/**
 * Supabase Edge Function: telegram-webhook
 *
 * Receives webhook updates from Telegram Bot API.
 * - Handles `/start <CODE>`: validates expiry, links user_id to chat_id, deletes code, replies "Connected ✅".
 * - Handles `/stop`: unlinks the chat_id, replies "Unlinked ✅".
 * - Ignores all other inputs. Never asks for or stores phone numbers.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
}

serve(async (req) => {
  // Only accept POST from Telegram
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const update = await req.json();
    const message = update.message;

    if (!message || !message.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chatId = message.chat.id;
    const rawText = message.text.trim();
    const upperText = rawText.toUpperCase();

    // 1. Check for connection code (via /start FLOW-XXXX, /start=FLOW-XXXX, or typed FLOW-XXXX)
    let connectionCode: string | null = null;

    if (upperText.startsWith('/START')) {
      // e.g. "/start FLOW-7K29" or "/start FLOW7K29" or "/start"
      const parts = rawText.split(/\s+|=/);
      if (parts[1]) {
        connectionCode = parts[1].trim().toUpperCase();
      }
    } else if (upperText.startsWith('FLOW-') || /^FLOW[0-9A-Z]{4}$/i.test(upperText)) {
      // User directly pasted the code into the bot chat
      connectionCode = rawText.trim().toUpperCase();
    }

    // 2. Handle connection if code is supplied
    if (connectionCode) {
      const code = connectionCode;

      // Validate code in link_codes
      const nowIso = new Date().toISOString();
      const { data: codeRecord, error: codeErr } = await supabaseAdmin
        .from('link_codes')
        .select('*')
        .eq('code', code)
        .gt('expires_at', nowIso)
        .maybeSingle();

      if (codeErr || !codeRecord) {
        await sendTelegramMessage(
          chatId,
          `⚠️ <b>លេខកូដមិនត្រឹមត្រូវ ឬផុតកំណត់</b>\n\nលេខកូដមានសុពលភាពត្រឹម ១៥ នាទីប៉ុណ្ណោះ។ សូមត្រឡប់ទៅកម្មវិធី «ម៉ែ» ដើម្បីបង្កើតលេខកូដថ្មី។\n\nThis code is invalid or has expired (15 mins). Please generate a new code in the FlowErs app.`
        );
        return new Response(JSON.stringify({ ok: true }));
      }

      // Upsert into telegram_links using service role (links user_id <-> chat_id)
      const userId = codeRecord.user_id;
      const { error: linkErr } = await supabaseAdmin.from('telegram_links').upsert(
        {
          user_id: userId,
          chat_id: chatId,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (linkErr) {
        console.error('Error linking Telegram:', linkErr);
        await sendTelegramMessage(
          chatId,
          `⚠️ មានបញ្ហាក្នុងការភ្ជាប់ សូមព្យាយាមម្តងទៀត។\nAn error occurred while linking. Please try again.`
        );
        return new Response(JSON.stringify({ ok: true }));
      }

      // Ensure entitlements and user is_premium are activated
      try {
        await supabaseAdmin.from('entitlements').upsert(
          {
            user_id: userId,
            is_premium: true,
            granted_at: new Date().toISOString(),
            notes: 'Connected via Telegram',
          },
          { onConflict: 'user_id' }
        );
        await supabaseAdmin.from('users').update({ is_premium: true }).eq('id', userId);
      } catch (entErr) {
        console.warn('Could not update entitlements:', entErr);
      }

      // Invalidate temporary token immediately after successful use (single-use)
      await supabaseAdmin.from('link_codes').delete().eq('code', code);

      // Reply success confirmation as requested
      await sendTelegramMessage(
        chatId,
        `🌸 <b>បានភ្ជាប់ជោគជ័យ! Connected ✅</b>\n\n🌸 <b>Your FlowErs account has been successfully connected to Telegram.</b>\n\n«ម៉ែ» (FlowErs) នឹងផ្ញើសាររំលឹកកិច្ចការថែទាំសុខភាពប្រចាំថ្ងៃរបស់អ្នកនៅវេលាម៉ោង <b>៨:០០ ព្រឹក</b> (ម៉ោងនៅកម្ពុជា)។\n\n• ផ្ញើតែចំណងជើងការងារដែលបានកំណត់ជាមុន មិនមានព័ត៌មានផ្ទាល់ខ្លួនឡើយ\n• បើអ្នកចង់ផ្តាច់សាររំលឹកវិញ សូមវាយពាក្យ <b>/stop</b>\n\nYou will now receive daily reminders at 8:00 AM Cambodia time for your due plan items. To unlink anytime, send /stop.`
      );

      return new Response(JSON.stringify({ ok: true }));
    }

    // 3. Handle plain /start without code
    if (upperText === '/START') {
      await sendTelegramMessage(
        chatId,
        `🌸 <b>សូមស្វាគមន៍មកកាន់ «ម៉ែ» (FlowErs)</b>\n\nដើម្បីភ្ជាប់ការរំលឹក សូមចូលទៅកាន់កម្មវិធី «ម៉ែ» រួចចុចប៊ូតុង <i>Purchase / Upgrade Plan</i> ឬ <i>ភ្ជាប់ Telegram</i> ដើម្បីទទួលបានលេខកូដបណ្តោះអាសន្ន។\n\nWelcome! To connect your account, generate a temporary connection code on the FlowErs website and tap "Connect with Telegram" or enter the code here.`
      );
      return new Response(JSON.stringify({ ok: true }));
    }

    // 2. Handle /stop
    if (text === '/stop') {
      const { error: delErr } = await supabaseAdmin
        .from('telegram_links')
        .delete()
        .eq('chat_id', chatId);

      if (delErr) {
        console.error('Error unlinking Telegram:', delErr);
      }

      await sendTelegramMessage(
        chatId,
        `🌸 <b>បានផ្តាច់ការរំលឹក Unlinked ✅</b>\n\nអ្នកបានផ្តាច់ការរំលឹកពី «ម៉ែ» ដោយជោគជ័យ។ អ្នកនឹងលែងទទួលបានសាររំលឹកប្រចាំថ្ងៃទៀតហើយ។ អ្នកអាចភ្ជាប់ឡើងវិញបានគ្រប់ពេលក្នុងកម្មវិធី «ម៉ែ»។\n\nReminders turned off successfully.`
      );

      return new Response(JSON.stringify({ ok: true }));
    }

    // Default response for unrecognized text
    await sendTelegramMessage(
      chatId,
      `🌸 «ម៉ែ» ទទួលសារនេះហើយ។ បូតនេះប្រើសម្រាប់តែផ្ញើសាររំលឹកប្រចាំថ្ងៃប៉ុណ្ណោះ។\n• បើចង់ផ្តាច់ សូមវាយ /stop\n• This bot only sends scheduled daily plan reminders.`
    );

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
});
