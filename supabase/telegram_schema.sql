/**
 * Supabase Edge Function: daily-reminders
 *
 * Runs once a day at 8:00 AM Cambodia time (01:00 UTC).
 * - Finds all linked users in `telegram_links`.
 * - Finds items due today in `plan_items` (start_date <= today <= end_date, done = false).
 * - Sends ONE daily message listing pre-written items. Never sends personal notes.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getCambodiaDateStr(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

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
  try {
    const todayStr = getCambodiaDateStr();
    console.log(`[daily-reminders] Starting morning dispatch for Cambodia date: ${todayStr}`);

    // 1. Fetch all linked users
    const { data: links, error: linksErr } = await supabaseAdmin
      .from('telegram_links')
      .select('user_id, chat_id');

    if (linksErr || !links || links.length === 0) {
      console.log('[daily-reminders] No linked users found.');
      return new Response(JSON.stringify({ sent: 0, message: 'No linked users' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let messagesSent = 0;

    // 2. For each linked user, query active plan items due today
    for (const link of links) {
      const { data: items, error: itemsErr } = await supabaseAdmin
        .from('plan_items')
        .select('id, text_kh, text_en')
        .eq('user_id', link.user_id)
        .eq('done', false)
        .lte('start_date', todayStr)
        .gte('end_date', todayStr);

      if (itemsErr || !items || items.length === 0) {
        continue; // Nothing due today for this user, do not disturb her!
      }

      // Build gentle message with pre-written items
      const itemLines = items
        .map((it, idx) => `  ${idx + 1}. 🌸 ${it.text_kh || it.text_en}`)
        .join('\n');

      const message = `🌸 <b>អរុណសួស្តីពី «ម៉ែ»! Good morning!</b>\n\nនេះជាការរំលឹកសុខភាពសម្រាប់ថ្ងៃនេះ (${todayStr})៖\n\n${itemLines}\n\n<i>កុំភ្លេចថែរក្សាសុខភាព និងញ៉ាំទឹកឱ្យបានគ្រប់គ្រាន់ណា៎។\nបើចង់ផ្តាច់សាររំលឹក សូមវាយ /stop</i>`;

      await sendTelegramMessage(link.chat_id, message);
      messagesSent++;
    }

    console.log(`[daily-reminders] Successfully dispatched ${messagesSent} messages.`);
    return new Response(JSON.stringify({ success: true, sent: messagesSent, date: todayStr }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[daily-reminders] Error running reminders dispatch:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
});
