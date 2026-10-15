/**
 * ម៉ែ — by FlowErs
 * UpgradeModal Component
 *
 * Connects the logged-in user's website account to the existing FlowErs Telegram chatbot.
 *
 * Flow:
 * 1. User clicks "Purchase / Upgrade Plan" -> Modal opens "Connect your Telegram".
 * 2. Generates a temporary, cryptographically random, single-use 15-minute code (FLOW-XXXX).
 * 3. Displays QR code containing Telegram deep link + connection code + "Connect with Telegram" button.
 * 4. Automatically polls backend table (telegram_links) for link confirmation.
 * 5. On confirmation -> Updates UI to "✅ Telegram Connected".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Sparkles,
  CalendarCheck,
  Send,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  BookOpen,
  AlertCircle,
  Copy,
  Check,
  QrCode,
  RefreshCw,
  ExternalLink,
  LogIn,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import {
  getTimeUntilMidnightCambodia,
  FREE_LIMITS,
  generateTelegramConnectionCode,
} from '../lib/entitlements';
import { supabase } from '../lib/supabase';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  source = 'plan_feature',
}) => {
  const {
    user,
    isAuthenticated,
    isPremium,
    currentWeek,
    logEvent,
    showToast,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthModalMode,
    updateUserPreferences,
    t,
  } = useApp();

  const [step, setStep] = useState<'connecting' | 'connected'>('connecting');
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(15 * 60);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAlreadyLinked, setIsAlreadyLinked] = useState(false);
  const [linkedChatId, setLinkedChatId] = useState<number | null>(null);
  const [showFeaturesList, setShowFeaturesList] = useState(false);

  const pollIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const botUsername = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'MaeFlowErsBot').replace('@', '');

  // Log paywall_shown event whenever the modal becomes visible
  useEffect(() => {
    if (isOpen && !isPremium) {
      logEvent('paywall_shown', undefined, currentWeek, {
        feature: source,
        timestamp: new Date().toISOString(),
      });
    }
  }, [isOpen, isPremium, source, currentWeek, logEvent]);

  // Generate temporary 15-minute token & QR code
  const handleStartTelegramConnect = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setIsGenerating(true);
      logEvent('upgrade_interest', undefined, currentWeek, {
        source,
        action: 'start_telegram_connect',
      });

      // 1. Generate unique temporary code (FLOW-XXXX)
      const code = generateTelegramConnectionCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // 2. Clear any prior codes for this user
      await supabase.from('link_codes').delete().eq('user_id', user.id);

      // 3. Save new temporary code in link_codes table
      const { error } = await supabase.from('link_codes').insert({
        code,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        console.error('Failed to create temporary link code', error);
        showToast(t('មិនអាចបង្កើតលេខកូដបានទេ សូមព្យាយាមម្តងទៀត', 'Could not create code, please try again'));
        return;
      }

      // 4. Generate QR Code with Telegram deep link
      const deepLink = `https://t.me/${botUsername}?start=${code}`;
      const dataUrl = await QRCode.toDataURL(deepLink, {
        width: 240,
        margin: 2,
        color: {
          dark: '#233125',
          light: '#FFFFFF',
        },
      });

      setConnectionCode(code);
      setCodeExpiresAt(expiresAt);
      setQrDataUrl(dataUrl);
      setStep('connecting');
    } catch (err) {
      console.error('Error initiating Telegram connect:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, currentWeek, source, botUsername, logEvent, showToast, t]);

  // On open: check if already linked or auto-start code generation
  useEffect(() => {
    if (isOpen) {
      if (user?.id) {
        supabase
          .from('telegram_links')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setIsAlreadyLinked(true);
              setLinkedChatId(data.chat_id);
              setStep('connected');
            } else {
              setIsAlreadyLinked(false);
              setLinkedChatId(null);
              handleStartTelegramConnect();
            }
          });
      } else {
        setIsAlreadyLinked(false);
        setLinkedChatId(null);
        setStep('connecting');
      }
    }
  }, [isOpen, user?.id, handleStartTelegramConnect]);

  // Countdown timer for 15-minute token
  useEffect(() => {
    if (step === 'connecting' && codeExpiresAt) {
      const updateTimer = () => {
        const diff = Math.max(0, Math.floor((codeExpiresAt.getTime() - Date.now()) / 1000));
        setRemainingSeconds(diff);
        if (diff === 0 && countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };

      updateTimer();
      countdownIntervalRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [step, codeExpiresAt]);

  // Polling for connection when waiting on code
  useEffect(() => {
    if (step === 'connecting' && user?.id && connectionCode) {
      pollIntervalRef.current = setInterval(async () => {
        const { data } = await supabase
          .from('telegram_links')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setLinkedChatId(data.chat_id);
          setIsAlreadyLinked(true);
          setStep('connected');
          updateUserPreferences({ is_premium: true });
          logEvent('telegram_linked', undefined, currentWeek, {
            chat_id: data.chat_id,
            source: 'upgrade_flow',
          });
          showToast(t('បានភ្ជាប់ Telegram ដោយជោគជ័យ 🌸', 'Telegram connected successfully 🌸'));
        }
      }, 2500);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [step, user?.id, connectionCode, currentWeek, logEvent, showToast, updateUserPreferences, t]);

  // Cleanup on close
  const handleClose = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setConnectionCode(null);
    setQrDataUrl('');
    onClose();
  };

  const handleCopyCode = async () => {
    if (!connectionCode) return;
    try {
      await navigator.clipboard.writeText(connectionCode);
      setCopied(true);
      showToast(t('បានចម្លងលេខកូដរួចរាល់ 📋', 'Connection code copied 📋'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(connectionCode);
    }
  };

  // Developer / Tester simulation helper to verify without live bot webhook
  const handleSimulateBotConfirmation = async () => {
    if (!user?.id || !connectionCode) return;

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

      await supabase.from('link_codes').delete().eq('code', connectionCode);

      setLinkedChatId(mockChatId);
      setIsAlreadyLinked(true);
      setStep('connected');
      updateUserPreferences({ is_premium: true });
      showToast(t('បានតេស្តភ្ជាប់ជោគជ័យ (Simulated) ✅', 'Connection simulated successfully ✅'));
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const handleGoToPlan = () => {
    handleClose();
    setActiveTab('plan');
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!isOpen || (isPremium && step === 'connecting' && isAlreadyLinked)) return null;

  const isDailyLimit = source === 'daily_limit';
  const resetTime = getTimeUntilMidnightCambodia();
  const deepLinkUrl = connectionCode
    ? `https://t.me/${botUsername}?start=${connectionCode}`
    : `https://t.me/${botUsername}`;

  const FEATURES = [
    {
      icon: <BookOpen className="w-5 h-5 text-[#88A04D]" />,
      titleKh: 'ការអានសង្ខេបមិនកំណត់ (Unlimited Summaries)',
      titleEn: 'Unlimited Summaries Every Day',
      descKh: 'អានសង្ខេបគ្រប់ប្រធានបទទាំងអស់ដោយគ្មានដែនកំណត់ (គណនីឥតគិតថ្លៃអានបាន ២ អត្ថបទ/ថ្ងៃ)។',
      descEn: 'Read every curated summary freely without daily limits (free tier includes 2 summaries/day).',
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-[#88A04D]" />,
      titleKh: 'គម្រោងថែទាំសុខភាពប្រចាំថ្ងៃ (Daily Plan)',
      titleEn: 'Personal Daily Checklist',
      descKh: 'ជ្រើសរើសការណែនាំពីអត្ថបទ និងសារសំឡេង ដាក់ចូលកាលវិភាគដើម្បីងាយស្រួលអនុវត្ត។',
      descEn: 'Save curated recommendations directly into your daily routine with zero stress.',
    },
    {
      icon: <Send className="w-5 h-5 text-[#88A04D]" />,
      titleKh: 'ការរំលឹកតាម Telegram ផ្ទាល់ខ្លួន (Telegram Reminders)',
      titleEn: 'Daily Telegram Alerts',
      descKh: 'សាររំលឹកមួយលើកក្នុងមួយថ្ងៃ នៅម៉ោង ៨:០០ ព្រឹក អំពីកិច្ចការដែលត្រូវធ្វើក្នុងថ្ងៃនោះ។',
      descEn: 'One gentle morning message at 8:00 AM (Phnom Penh) with your daily reminders.',
    },
    {
      icon: <Clock className="w-5 h-5 text-[#88A04D]" />,
      titleKh: 'ការរំលឹកញ៉ាំថ្នាំ និងការណាត់ជួបពេទ្យ',
      titleEn: 'Supplements & Antenatal Checkups',
      descKh: 'កុំឱ្យភ្លេចលេបថ្នាំជាតិដែក អាស៊ីតហ្វូលិក និងថ្ងៃត្រូវទៅជួបគ្រូពេទ្យ ឬឆ្មប។',
      descEn: 'Never miss iron/folate supplements and official antenatal visits.',
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#88A04D]" />,
      titleKh: 'ការនាំចេញទៅកាន់ប្រតិទិន (Calendar Export)',
      titleEn: 'Calendar Sync & Export',
      descKh: 'រក្សាទុកការណាត់ជួបទៅក្នុងប្រតិទិនទូរស័ព្ទរបស់អ្នកដោយស្វ័យប្រវត្តិ។',
      descEn: 'Export appointments and checkups to your phone calendar.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slide-up">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E5EADF] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-xl shadow-2xs">
              {step === 'connected' ? '✅' : '🌸'}
            </span>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#88A04D] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>
                  {step === 'connected'
                    ? t('បានភ្ជាប់រួចរាល់', 'Connected')
                    : t('ភ្ជាប់ជាមួយ Telegram', 'Connect Telegram')}
                </span>
              </div>
              <h2
                id="upgrade-modal-title"
                className="text-base sm:text-lg font-serif font-bold text-[#233125] leading-snug"
              >
                {step === 'connected'
                  ? t('ភ្ជាប់ Telegram ជោគជ័យ!', 'Telegram Connected Successfully')
                  : t('ភ្ជាប់គណនី Telegram របស់អ្នក', 'Connect your Telegram')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* STEP: CONNECTING / QR CODE & TEMPORARY CODE */}
          {step === 'connecting' && (
            <div className="space-y-5 animate-fade-in text-center">
              {/* Daily Limit Warning if triggered from summary quota */}
              {isDailyLimit && (
                <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#E0C068]/50 text-left space-y-1.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#B27B00] shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-[#5C4200]">
                      {t(
                        `អ្នកបានអានសង្ខេបឥតគិតថ្លៃគ្រប់ ${FREE_LIMITS.dailySummaries} អត្ថបទសម្រាប់ថ្ងៃនេះហើយ`,
                        `You've reached your free daily limit of ${FREE_LIMITS.dailySummaries} summaries for today.`
                      )}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#7A5B00] leading-relaxed pl-6">
                    {t(
                      `ដែនកំណត់នឹងកំណត់ឡើងវិញនៅពាក់កណ្តាលអធ្រាត្រ (នៅសល់ប្រហែល ${resetTime.formattedKh})។ ភ្ជាប់ Telegram ដើម្បីដោះសោការរំលឹកប្រចាំថ្ងៃ និងសិទ្ធិប្រើប្រាស់ពេញលេញ។`,
                      `Quota resets at midnight Asia/Phnom_Penh (in ~${resetTime.formattedEn}). Connect Telegram to unlock daily reminders and full routine access.`
                    )}
                  </p>
                  <div className="pt-1.5 border-t border-[#E0C068]/30 text-[11px] text-[#5C4200] flex items-center gap-1.5 font-medium pl-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#88A04D]" />
                    <span>
                      {t(
                        'អត្ថបទសញ្ញាគ្រោះថ្នាក់បន្ទាន់ និងសារសំឡេងទាំងអស់ នៅតែឥតគិតថ្លៃជានិច្ច!',
                        'Safety-critical warning signs and voice messages are always 100% free!'
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Logged in vs Not logged in */}
              {!isAuthenticated ? (
                <div className="p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center mx-auto">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#233125]">
                      {t('សូមចូលគណនីជាមុនសិន', 'Please log in first')}
                    </h3>
                    <p className="text-xs text-[#5F6E60] max-w-sm mx-auto leading-relaxed">
                      {t(
                        'ដើម្បីបង្កើតលេខកូដភ្ជាប់ Telegram និងទទួលសាររំលឹកផ្ទាល់ខ្លួន សូមចូលគណនី ឬចុះឈ្មោះ។',
                        'To generate a connection code and link your FlowErs account to Telegram, please sign in or register.'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t('ចូលគណនី / ចុះឈ្មោះ', 'Sign in / Register')}</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-1 text-center">
                    <h3 className="text-base sm:text-lg font-bold text-[#233125]">
                      {t('ភ្ជាប់ជាមួយ Telegram', 'Connect your Telegram')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5F6E60] leading-relaxed max-w-sm mx-auto">
                      {t(
                        'ដើម្បីទទួលសាររំលឹកកិច្ចការថែទាំសុខភាពពី «ម៉ែ» និងបន្ត សូមភ្ជាប់គណនី Telegram របស់អ្នក។',
                        'To receive your FlowErs reminders and continue, connect your Telegram account.'
                      )}
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="inline-block p-4 bg-white rounded-3xl border border-[#E5EADF] shadow-md mx-auto relative group">
                    {qrDataUrl ? (
                      <div className="space-y-2">
                        <img
                          src={qrDataUrl}
                          alt="Telegram Deep Link QR Code"
                          className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-2xl"
                        />
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#88A04D]">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{t('ស្កេនតាមទូរស័ព្ទដៃ', 'Scan with phone camera')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center bg-[#FAF9F5] rounded-2xl">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#88A04D]" />
                      </div>
                    )}
                  </div>

                  {/* Temporary Code Display */}
                  <div className="space-y-2 max-w-sm mx-auto">
                    <span className="text-xs text-[#5F6E60] block font-medium">
                      {t('ឬវាយលេខកូដនេះក្នុងតេឡេក្រាមបូត FlowErs៖', 'Or enter this code in the FlowErs Telegram bot:')}
                    </span>

                    <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-2xl border-2 border-[#88A04D]/40 shadow-2xs">
                      <span className="font-mono font-extrabold text-xl sm:text-2xl tracking-widest text-[#233125]">
                        {connectionCode || '...'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="min-h-[40px] px-3 rounded-xl bg-[#EBF1E4] text-[#5C7034] hover:bg-[#88A04D] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                        title={t('ចម្លងលេខកូដ', 'Copy code')}
                      >
                        {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? t('បានចម្លង', 'Copied') : t('ចម្លង', 'Copy')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Open Telegram Direct Button */}
                  <div className="space-y-2 pt-1 max-w-sm mx-auto">
                    <a
                      href={deepLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[48px] w-full px-6 py-3 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('ភ្ជាប់ជាមួយ Telegram', 'Connect with Telegram')}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {/* Status Indicator & Expiration Countdown */}
                    <div className="flex items-center justify-center gap-2 text-xs text-[#5F6E60] pt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>
                        {remainingSeconds > 0 ? (
                          <>
                            {t('កំពុងរង់ចាំការភ្ជាប់...', 'Waiting for connection...')} (
                            {t('ផុតកំណត់ក្នុង', 'Expires in')}: {formatCountdown(remainingSeconds)})
                          </>
                        ) : (
                          <span className="text-red-600 font-medium">
                            {t('លេខកូដបានផុតកំណត់', 'Code expired.')}
                          </span>
                        )}
                      </span>
                    </div>

                    {remainingSeconds === 0 && (
                      <button
                        type="button"
                        onClick={handleStartTelegramConnect}
                        className="text-xs text-[#88A04D] underline font-semibold cursor-pointer"
                      >
                        {t('បង្កើតលេខកូដថ្មី', 'Generate new code')}
                      </button>
                    )}
                  </div>

                  {/* Developer / Tester simulation tool */}
                  <div className="pt-3 border-t border-[#E5EADF]/60">
                    <button
                      type="button"
                      onClick={handleSimulateBotConfirmation}
                      className="text-[11px] text-[#5C7034] hover:text-[#233125] bg-[#EBF1E4]/60 hover:bg-[#EBF1E4] px-3.5 py-1.5 rounded-full border border-[#88A04D]/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="Simulate bot receiving temporary code for instant testing"
                    >
                      <span>🧪</span>
                      <span>{t('តេស្ត៖ ក្លែងបន្លំការភ្ជាប់បូត (Tester Simulation)', 'Tester: Simulate Bot Confirmation')}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Expandable Section: What's included in My Plan */}
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => setShowFeaturesList(!showFeaturesList)}
                  className="w-full p-3 rounded-2xl bg-white border border-[#E5EADF] text-xs font-bold text-[#233125] flex items-center justify-between cursor-pointer hover:bg-[#FAF9F5] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#88A04D]" />
                    <span>{t('មុខងារពិសេសក្នុង My Plan', "What's included in My Plan")}</span>
                  </span>
                  {showFeaturesList ? (
                    <ChevronUp className="w-4 h-4 text-[#5F6E60]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5F6E60]" />
                  )}
                </button>

                {showFeaturesList && (
                  <div className="mt-2 space-y-2 animate-fade-in">
                    {FEATURES.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-[#E5EADF] flex items-start gap-2.5 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#CAD6BE] flex items-center justify-center shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#233125] leading-tight">
                            {t(item.titleKh, item.titleEn)}
                          </h4>
                          <p className="text-[11px] text-[#5F6E60] mt-0.5 leading-relaxed">
                            {t(item.descKh, item.descEn)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP: CONNECTED SCREEN */}
          {step === 'connected' && (
            <div className="py-6 space-y-5 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#88A04D] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EBF1E4] text-[#5C7034] text-xs font-bold uppercase tracking-wider">
                  ✅ {t('បានភ្ជាប់ Telegram ដោយជោគជ័យ', 'Telegram Connected')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#233125]">
                  {t('ភ្ជាប់ Telegram ជោគជ័យ!', 'Telegram connected successfully')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C7034] max-w-sm mx-auto leading-relaxed font-medium">
                  {t(
                    '🌸 គណនី FlowErs របស់អ្នកត្រូវបានភ្ជាប់ជាមួយ Telegram ដោយជោគជ័យ។ អ្នកនឹងទទួលបានសាររំលឹកកិច្ចការថែទាំសុខភាពជារៀងរាល់ថ្ងៃនៅម៉ោង ៨:០០ ព្រឹក។',
                    '🌸 Your FlowErs account has been successfully connected to Telegram. You will now receive daily morning plan reminders at 8:00 AM.'
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5EADF] shadow-2xs max-w-sm mx-auto text-left text-xs space-y-2 text-[#5F6E60]">
                <div className="flex items-center gap-2 text-[#233125] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#88A04D]" />
                  <span>{t('ព័ត៌មានលម្អិតនៃការភ្ជាប់៖', 'Connection Details:')}</span>
                </div>
                <div className="pl-6 space-y-1 text-[11px]">
                  <p>• {t('លេខសម្គាល់ Chat ID៖', 'Telegram Chat ID:')} <span className="font-mono text-[#233125]">{linkedChatId || 'Linked'}</span></p>
                  <p>• {t('ម៉ោងរំលឹក៖ ៨:០០ ព្រឹក (ម៉ោងនៅភ្នំពេញ)', 'Delivery time: 8:00 AM Cambodia time')}</p>
                  <p>• {t('បើចង់ផ្តាច់សាររំលឹកវិញ៖ គ្រាន់តែវាយ /stop ក្នុងតេឡេក្រាម', 'To unlink anytime: send /stop in Telegram')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E5EADF] flex items-center justify-between gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step === 'connected' ? (
            <button
              type="button"
              onClick={handleGoToPlan}
              className="min-h-[44px] w-full px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('ទៅកាន់គម្រោងរបស់ខ្ញុំ 🌸', 'Go to My Plan 🌸')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#E5EADF] text-xs font-semibold text-[#5F6E60] hover:text-[#233125] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
              >
                {t('បិទ', 'Close')}
              </button>

              {user?.id && (
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleStartTelegramConnect}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#EBF1E4] hover:bg-[#CAD6BE] text-[#5C7034] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Generate a fresh 15-minute connection token"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{t('លេខកូដថ្មី', 'New Code')}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
