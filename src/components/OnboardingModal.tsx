/**
 * ម៉ែ — by FlowErs
 * Streamlined Onboarding Modal (Step R3)
 *
 * Keeps Name, Language, and Notification preference.
 * (Pregnancy week and due date are already accurately collected by the pre-login wizard).
 */

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, Bell, Globe, Heart, Send } from 'lucide-react';
import { UserLanguage, NotificationPreference } from '../types';
import { useApp } from '../context/AppContext';
import { TelegramLink } from './TelegramLink';

export const OnboardingModal: React.FC = () => {
  const { user, isOnboardingOpen, completeOnboarding, t } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState<UserLanguage>(user?.language || 'km');
  const [notificationPreference, setNotificationPreference] = useState<NotificationPreference>('weekly');

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      name: name.trim() || user?.name || 'Mama',
      pregnancy_week: user?.pregnancy_week || 9,
      due_date: user?.due_date,
      language,
      notification_preference: notificationPreference,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
        {/* Step Indicator - Sticky */}
        {step <= 3 && (
          <div className="p-4 sm:p-5 bg-white border-b border-[#E5EADF] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    i === step
                      ? 'bg-[#88A04D] w-8'
                      : i < step
                      ? 'bg-[#88A04D]/60'
                      : 'bg-[#E5EADF]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-medium text-[#5F6E60]">
              {step} / 3
            </span>
          </div>
        )}

        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-xl">
                🌸
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#233125]">
                  {t('តើម៉ែគួរហៅអ្នកបែបណា?', 'What should Mea call you?')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6E60]">
                  {t('ឈ្មោះហៅក្រៅ ឬឈ្មោះផ្ទាល់ខ្លួនដែលអ្នកពេញចិត្ត។', 'A sweet name or nickname you love.')}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('ឧទាហរណ៍៖ ស្រីស្រស់ ឬ ចាន់ថន', 'e.g. Sreysros')}
                  className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-white border border-[#E5EADF] text-base text-[#233125] focus:border-[#88A04D] focus:ring-1 focus:ring-[#88A04D]"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full min-h-[48px] py-3 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{t('បន្តទៅមុខ', 'Continue')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Language Selection (Khmer Default) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-xl">
                🌐
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#233125]">
                  {t('ភាសាដែលអ្នកចង់ប្រើ', 'Choose your language')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6E60]">
                  {t('អ្នកអាចប្តូរភាសាបានគ្រប់ពេល។', 'You can change this at any time.')}
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setLanguage('km')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'km'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <div>
                    <span className="text-base font-bold text-[#233125] block font-serif">
                      ភាសាខ្មែរ (Khmer)
                    </span>
                    <span className="text-xs text-[#5F6E60]">
                      ភាសាចម្បងសម្រាប់អ្នកម្តាយកម្ពុជា
                    </span>
                  </div>
                  {language === 'km' && <Check className="w-5 h-5 text-[#88A04D]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'en'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <div>
                    <span className="text-base font-bold text-[#233125] block">
                      English
                    </span>
                    <span className="text-xs text-[#5F6E60]">
                      English guidance & references
                    </span>
                  </div>
                  {language === 'en' && <Check className="w-5 h-5 text-[#88A04D]" />}
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[48px] min-w-[48px] px-4 py-3 rounded-full border border-[#E5EADF] text-xs font-semibold text-[#5F6E60] hover:bg-white flex items-center justify-center"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 min-h-[48px] py-3 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('បន្តទៅមុខ', 'Continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Notification Preference */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-xl">
                🔔
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#233125]">
                  {t('ការទទួលការរំលឹកពីម៉ែ', 'Receiving reminders')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6E60]">
                  {t('ជ្រើសរើសភាពញឹកញាប់នៃការរំលឹកដែលធ្វើឱ្យអ្នកមានអារម្មណ៍ស្រួល។', 'Choose how often you would like to be gently notified.')}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'weekly',
                    titleKh: 'ប្រចាំសប្ដាហ៍ (ណែនាំ)',
                    titleEn: 'Weekly (Recommended)',
                    descKh: 'ទទួលសារលើកទឹកចិត្ត និងការវិវឌ្ឍន៍ ១ ដងក្នុងមួយសប្ដាហ៍',
                    descEn: 'One gentle update and encouraging note each week',
                  },
                  {
                    id: 'daily',
                    titleKh: 'ប្រចាំថ្ងៃ',
                    titleEn: 'Daily',
                    descKh: 'ការរំលឹកសុខភាពតូចមួយរាល់ព្រឹក',
                    descEn: 'A short morning health reminder',
                  },
                  {
                    id: 'none',
                    titleKh: 'មិនបាច់រំលឹក',
                    titleEn: 'None',
                    descKh: 'ខ្ញុំនឹងចូលមើលដោយខ្លួនឯងនៅពេលទំនេរ',
                    descEn: "I'll open the app whenever I feel like it",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setNotificationPreference(opt.id as NotificationPreference)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                      notificationPreference === opt.id
                        ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                        : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-[#233125] block">
                        {t(opt.titleKh, opt.titleEn)}
                      </span>
                      <span className="text-xs text-[#5F6E60] mt-0.5 block">
                        {t(opt.descKh, opt.descEn)}
                      </span>
                    </div>
                    {notificationPreference === opt.id && (
                      <Check className="w-5 h-5 text-[#88A04D] shrink-0 ml-2 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              {/* Optional Telegram linking */}
              <div className="pt-2">
                <TelegramLink />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-[48px] min-w-[48px] px-4 py-3 rounded-full border border-[#E5EADF] text-xs font-semibold text-[#5F6E60] hover:bg-white flex items-center justify-center"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 min-h-[48px] py-3 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('បន្តទៅមុខ', 'Continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Finish Screen: Welcome */}
          {step === 4 && (
            <div className="text-center space-y-5 py-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#EBF1E4] border-2 border-[#88A04D]/40 flex items-center justify-center text-4xl mx-auto shadow-sm">
                🌸
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#88A04D]" />
                  <span>{t('ការរៀបចំបានជោគជ័យ', 'Setup Complete')}</span>
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#233125]">
                  {t(`សូមស្វាគមន៍មកកាន់ ម៉ែ, ${name} 🌸`, `Welcome to Mea, ${name} 🌸`)}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6E60] max-w-xs mx-auto leading-relaxed">
                  {t(
                    'ម៉ែបានរៀបចំព័ត៌មាន និងការណែនាំសុខភាពដែលសមស្របនឹងសប្ដាហ៍របស់អ្នករួចរាល់ហើយ។',
                    'Mea has personalized gentle guidance and trusted articles for your stage.'
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5EADF] text-left text-xs space-y-2 max-w-xs mx-auto">
                <div className="flex items-center justify-between text-[#5F6E60]">
                  <span>{t('សប្ដាហ៍ពពោះ៖', 'Pregnancy Week:')}</span>
                  <span className="font-semibold text-[#233125]">
                    {t(`សប្ដាហ៍ទី ${user?.pregnancy_week || 9}`, `Week ${user?.pregnancy_week || 9}`)}
                  </span>
                </div>
                {user?.due_date && (
                  <div className="flex items-center justify-between text-[#5F6E60]">
                    <span>{t('ថ្ងៃសម្រាល៖', 'Due Date:')}</span>
                    <span className="font-semibold text-[#233125]">{user.due_date}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#5F6E60]">
                  <span>{t('ភាសា៖', 'Language:')}</span>
                  <span className="font-semibold text-[#233125]">
                    {language === 'km' ? 'ភាសាខ្មែរ' : 'English'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full min-h-[48px] py-3.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('ចាប់ផ្តើមដំណើរកំដរ 🌸', 'Enter Companion 🌸')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
