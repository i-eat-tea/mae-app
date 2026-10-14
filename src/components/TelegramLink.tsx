/**
 * ម៉ែ — by FlowErs
 * TelegramLink Component
 *
 * Provides a gentle, privacy-conscious way for a mother to link her Telegram account.
 * - Single-use 15-minute verification code.
 * - Stores ONLY her Telegram chat_id (never phone numbers).
 * - Only sends pre-written item titles at 8:00 AM Cambodia time (01:00 UTC).
 * - Easy one-tap "Turn off" unlinking.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PowerOff,
  Sparkles,
  LogIn,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { TelegramLink as TelegramLinkType } from '../types';
import { generateTelegramConnectionCode } from '../lib/entitlements';

interface TelegramLinkProps {
  variant?: 'card' | 'compact' | 'onboarding';
  onLinked?: () => void;
}

export const TelegramLink: React.FC<TelegramLinkProps> = ({ variant = 'card', onLinked }) => {
  const {
    user,
    isAuthenticated,
    isPremium,
    setIsUpgradeModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    logEvent,
    currentWeek,
    showToast,
    updateUserPreferences,
    t,
  } = useApp();

  const [linkData, setLinkData] = useState<TelegramLinkType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [copied, setCopied] = useState(false);

  const pollIntervalRef = useRef<any>(null);

  const botUsername = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'MaeFlowErsBot').replace('@', '');

  // 1. Fetch current Telegram link for user
  const fetchLinkStatus = async () => {
    if (!user?.id) {
      setLinkData(null);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('telegram_links')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setLinkData(data as TelegramLinkType);
      } else {
        setLinkData(null);
      }
    } catch (err) {
      console.warn('Failed to fetch Telegram link', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkStatus();
  }, [user?.id]);

  // 2. Poll for connection when a code is active
  useEffect(() => {
    if (currentCode && !linkData && user?.id) {
      pollIntervalRef.current = setInterval(async () => {
        const { data } = await supabase
          .from('telegram_links')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setLinkData(data as TelegramLinkType);
          setCurrentCode(null);
          setCodeExpiresAt(null);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          logEvent('telegram_linked', undefined, currentWeek, { chat_id: data.chat_id });
          showToast(t('បានភ្ជាប់ Telegram ដោយជោគជ័យ 🌸', 'Telegram linked successfully 🌸'));
          if (onLinked) onLinked();
        }
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [currentCode, linkData, user?.id]);

  // 3. Generate a 15-minute single-use link code
  const handleGenerateCode = async () => {
    if (!user?.id) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!isPremium) {
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      setIsGenerating(true);

      // Generate temporary single-use code (e.g. FLOW-7K29)
      const code = generateTelegramConnectionCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Delete any previous unused codes for this user
      await supabase.from('link_codes').delete().eq('user_id', user.id);

      // Insert new code
      const { error } = await supabase.from('link_codes').insert({
        code,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        console.error('Failed to create link code', error);
        showToast(t('មិនអាចបង្កើតលេខកូដបានទេ សូមព្យាយាមម្តងទៀត', 'Could not create code, please try again'));
      } else {
        const deepLink = `https://t.me/${botUsername}?start=${code}`;
        const dataUrl = await QRCode.toDataURL(deepLink, {
          width: 200,
          margin: 2,
          color: { dark: '#233125', light: '#FFFFFF' },
        });
        setCurrentCode(code);
        setCodeExpiresAt(expiresAt);
        setQrDataUrl(dataUrl);
      }
    } catch (err) {
      console.error('Generate code error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      showToast(t('បានចម្លងលេខកូដរួចរាល់ 📋', 'Connection code copied 📋'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(currentCode);
    }
  };

  // Developer / Tester simulation helper
  const handleSimulateBotConfirmation = async () => {
    if (!user?.id || !currentCode) return;
    try {
      const mockChatId = Math.floor(100000000 + Math.random() * 900000000);
      await supabase.from('telegram_links').upsert({
        user_id: user.id,
        chat_id: mockChatId,
        created_at: new Date().toISOString(),
      });
      await supabase.from('entitlements').upsert({
        user_id: user.id,
        is_premium: true,
        granted_at: new Date().toISOString(),
        notes: 'Simulated Telegram Connection',
      });
      await supabase.from('link_codes').delete().eq('code', currentCode);
      updateUserPreferences({ is_premium: true });
      showToast(t('បានតេស្តភ្ជាប់ជោគជ័យ (Simulated) ✅', 'Connection simulated successfully ✅'));
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  // 4. Unlink Telegram
  const handleUnlink = async () => {
    if (!user?.id || !linkData) return;

    try {
      setIsUnlinking(true);
      const { error } = await supabase
        .from('telegram_links')
        .delete()
        .eq('user_id', user.id);

      if (!error) {
        logEvent('telegram_unlinked', undefined, currentWeek, { chat_id: linkData.chat_id });
        setLinkData(null);
        setCurrentCode(null);
        showToast(t('បានផ្តាច់ការរំលឹកតាម Telegram រួចរាល់', 'Telegram unlinked successfully'));
      } else {
        showToast(t('មិនអាចផ្តាច់បានទេ សូមព្យាយាមម្តងទៀត', 'Could not unlink, please try again'));
      }
    } catch (err) {
      console.error('Unlink error', err);
    } finally {
      setIsUnlinking(false);
    }
  };

  const telegramBotUrl = currentCode ? `https://t.me/${botUsername}?start=${currentCode}` : `https://t.me/${botUsername}`;

  // Guest view if not logged in
  if (!isAuthenticated) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 ml-0.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#233125]">
              {t('ទទួលការរំលឹកតាម Telegram 🌸', 'Get reminders on Telegram 🌸')}
            </h3>
            <p className="text-xs text-[#5F6E60]">
              {t('សាររំលឹកមួយលើកក្នុងមួយថ្ងៃ នៅម៉ោង ៨ ព្រឹក (ម៉ោងនៅកម្ពុជា)', 'One gentle reminder daily at 8:00 AM (Cambodia time)')}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF] text-xs text-[#5F6E60] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>{t('សូមចូលគណនីរបស់អ្នកដើម្បីភ្ជាប់ជាមួយ Telegram។', 'Please log in to link with Telegram.')}</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="min-h-[40px] px-4 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white font-semibold flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t('ចូលគណនី', 'Log in')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Connected state
  if (linkData) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#EBF1E4]/90 to-white border border-[#88A04D]/35 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#88A04D] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#233125]">
                  {t('បានភ្ជាប់ជាមួយ Telegram រួចរាល់ ✅', 'Connected to Telegram ✅')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#88A04D]/30 text-[10px] font-semibold text-[#5C7034]">
                  @{botUsername}
                </span>
              </div>
              <p className="text-xs text-[#5F6E60]">
                {t(
                  'អ្នកនឹងទទួលបានសាររំលឹកមួយលើកក្នុងមួយថ្ងៃ នៅម៉ោង ៨ ព្រឹក (ម៉ោងនៅកម្ពុជា) ជាមួយការងារដែលត្រូវធ្វើក្នុងថ្ងៃនោះ។',
                  'You will receive one daily message at 8:00 AM (Cambodia time) listing your items due that day.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isUnlinking}
            onClick={handleUnlink}
            className="min-h-[42px] px-4 py-2 rounded-full border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>{isUnlinking ? t('កំពុងផ្តាច់...', 'Disconnecting...') : t('ផ្តាច់ការតភ្ជាប់', 'Turn off')}</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#E5EADF]/80 flex items-center gap-1.5 text-[11px] text-[#5F6E60]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#88A04D]" />
          <span>
            {t(
              'រក្សាទុកត្រឹមតែ Telegram Chat ID។ គ្មានការរក្សាទុកលេខទូរស័ព្ទឡើយ។',
              'Stores only your Telegram Chat ID. Never stores phone numbers.'
            )}
          </span>
        </div>
      </div>
    );
  }

  // Not connected state
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 ml-0.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#233125]">
              {t('ទទួលការរំលឹកតាម Telegram 🌸', 'Get reminders on Telegram 🌸')}
            </h3>
            <p className="text-xs text-[#5F6E60] pt-0.5 leading-relaxed">
              {t(
                'Telegram នឹងផ្ញើសាររំលឹកកិច្ចការគម្រោងរបស់អ្នករៀងរាល់ម៉ោង ៨ ព្រឹក (ម៉ោងនៅកម្ពុជា)។',
                'Get your daily plan items delivered at 8:00 AM Cambodia time (01:00 UTC).'
              )}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-[11px] font-medium text-[#5F6E60] shrink-0">
          {t('មិនទាន់ភ្ជាប់', 'Not connected')}
        </span>
      </div>

      {/* Code generation block */}
      {!currentCode ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E5EADF]">
          <div className="flex items-center gap-1.5 text-xs text-[#5F6E60]">
            <Clock className="w-3.5 h-3.5 text-[#88A04D]" />
            <span>{t('ភ្ជាប់តែម្តង ប្រើបានរហូតដល់អ្នកផ្តាច់', 'Link once, active until you turn it off')}</span>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateCode}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {!isPremium
                ? t('ស្នើសុំសាកល្បង My Plan 🌸', 'Ask for Access (My Plan) 🌸')
                : isGenerating
                ? t('កំពុងបង្កើតកូដ...', 'Generating code...')
                : t('ភ្ជាប់ជាមួយ Telegram', 'Connect Telegram')}
            </span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#F0F4E8] border border-[#88A04D]/35 space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-[#5C7034] block">
                {t('លេខកូដភ្ជាប់គណនី (សុពលភាព ១៥ នាទី)៖', 'Your One-Time Link Code (Expires in 15 mins):')}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-xl bg-white border border-[#88A04D]/40 font-mono font-bold text-lg text-[#233125] tracking-widest shadow-2xs">
                  {currentCode}
                </span>
                <span className="text-xs text-[#5F6E60] animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{t('កំពុងរង់ចាំការភ្ជាប់...', 'Waiting for link...')}</span>
                </span>
              </div>
            </div>

            {/* Direct Link to Telegram Bot */}
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs sm:text-sm font-semibold shadow-xs inline-flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
              <span>{t('បើកក្នុង Telegram', 'Open in Telegram')}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          <p className="text-xs text-[#5F6E60] leading-relaxed pt-1 border-t border-[#88A04D]/20">
            {t(
              `ឬបើក Telegram ស្វែងរក @${botUsername} ហើយផ្ញើសារ៖ /start ${currentCode}`,
              `Or open Telegram, find @${botUsername}, and send: /start ${currentCode}`
            )}
          </p>
        </div>
      )}

      {/* Privacy Guarantee */}
      <div className="pt-2 border-t border-[#E5EADF] flex items-center gap-1.5 text-[11px] text-[#5F6E60]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#88A04D]" />
        <span>
          {t(
            'ប្រព័ន្ធរក្សាទុកត្រឹមតែ Telegram Chat ID របស់អ្នកប៉ុណ្ណោះ។ គ្មានការសួរ ឬរក្សាទុកលេខទូរស័ព្ទឡើយ។',
            'Stores only your Telegram Chat ID. We never ask for or store your phone number.'
          )}
        </span>
      </div>
    </div>
  );
};
