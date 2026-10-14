/**
 * ម៉ែ — by FlowErs
 * Landing Screen
 *
 * Welcoming visitor introduction:
 * "នៅក្បែរអ្នក និងកំដរអ្នក អំឡុងពេលពពោះលើកដំបូង។"
 * Emotional voice hook: "ម៉ែមានរឿងចង់ប្រាប់"
 *
 * Live version: real sign-up only (no demo account). Users are told up front
 * that their pregnancy details are saved and that cookies are used.
 *
 * Voice: "ម៉ែ" (Mom) is the app's NAME only. The app speaks as a friendly
 * companion, never as the user's mother. Address the user as "you" (អ្នក),
 * never as "child" (កូន).
 */

import React, { useState } from 'react';
import { ArrowRight, Heart, Headphones, Calendar, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FlowerVisual } from '../components/FlowerVisual';
import { MONTHLY_MOM_MESSAGES } from '../data/monthlyMessages';
import { PreLoginWizard, PreLoginAnswers } from '../components/PreLoginWizard';

export const LandingScreen: React.FC = () => {
  const { setIsAuthModalOpen, setAuthModalMode, t } = useApp();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleStart = () => {
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (_answers: PreLoginAnswers) => {
    setIsWizardOpen(false);
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  // NOTE: 'login' must match the mode name your AuthModal expects.
  const handleLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-2xl mx-auto px-4">
        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] mb-6 shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-[#88A04D] text-[#88A04D]" />
          <span>{t('ម៉ែ — by FlowErs · កម្មវិធីកំដរស្រ្តីមានផ្ទៃពោះលើកដំបូង', 'ម៉ែ — by FlowErs · Pregnancy Companion')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#233125] tracking-tight leading-[1.25] mb-4 text-balance">
          {t('នៅក្បែរអ្នក និងកំដរអ្នក', 'Here for you, and by your side')} <br />
          <span className="italic font-normal text-[#88A04D]">
            {t('អំឡុងពេលពពោះលើកដំបូង។', 'throughout your first pregnancy.')}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-[#5F6E60] leading-relaxed max-w-lg mx-auto mb-8 text-balance">
          {t(
            'ស្ងប់ចិត្ត ហើយទុកឱ្យ «ម៉ែ» រកព័ត៌មានផ្ដល់ជូនអ្នកតាមដំណាក់កាល។',
            'Relax, and let "ម៉ែ" find the right information for you at every stage.'
          )}
        </p>

        {/* Maternal Voice Quote */}
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-[#DDE8F1]/40 border border-[#DDE8F1] text-xs sm:text-sm text-[#233125] italic leading-relaxed">
          🌸 “{t('ដកដង្ហើមវែងៗ ហើយញញឹមឱ្យបានច្រើន។ អ្នកមិនឯកាទេ «ម៉ែ» នៅក្បែរអ្នកជានិច្ច។', 'Take a slow breath and smile often. You are not alone: ម៉ែ is right here beside you.')}”
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{t('ចាប់ផ្ដើម 🌸', 'Start 🌸')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F0F4E8] text-[#233125] border border-[#E5EADF] text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <span>{t('ខ្ញុំមានគណនីរួចហើយ', 'I already have an account')}</span>
          </button>
        </div>

        {/* Data & cookie notice */}
        <p className="mt-5 max-w-md mx-auto flex items-start justify-center gap-1.5 text-[11px] text-[#5F6E60] leading-relaxed text-left sm:text-center">
          <Lock className="w-3 h-3 mt-0.5 shrink-0 text-[#88A04D]" />
          <span>
            {t(
              'តាមរយៈការចាប់ផ្ដើម អ្នកយល់ព្រមឱ្យ «ម៉ែ» រក្សាទុកព័ត៌មានផ្ទៃពោះរបស់អ្នក និងប្រើ cookies ដើម្បីកែលម្អកម្មវិធី។',
              'By starting, you agree that ម៉ែ saves your pregnancy details and uses cookies to improve the app.'
            )}
          </span>
        </p>
      </section>

      {/* Flower Growth Journey Preview */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-6 sm:p-8 max-w-3xl mx-auto shadow-xs">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#88A04D] block mb-1">
            {t('រីកលូតលាស់ជាមួយអ្នក', 'Growing with you')}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#233125]">
            {t('ដូចផ្កាដែលកំពុងរីកស្រទាប់បន្តិចម្តងៗ', 'Like a flower quietly unfolding')}
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6E60] max-w-md mx-auto mt-1">
            {t(
              'ចាប់ពីគ្រាប់ពូជតូចមួយ រហូតដល់ក្លាយជាផ្ការីកស្គុះស្គាយ ដំណើរក្លាយជាម្តាយរបស់អ្នកនឹងរីកចម្រើនជាជំហានៗ។',
              'From a tender seed to a full blossom, your journey into motherhood unfolds step by step.'
            )}
          </p>
        </div>

        {/* 4 Preview Stages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            MONTHLY_MOM_MESSAGES[0],
            MONTHLY_MOM_MESSAGES[2],
            MONTHLY_MOM_MESSAGES[4],
            MONTHLY_MOM_MESSAGES[8],
          ].map((msg, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF]/60"
            >
              <FlowerVisual stage={msg.flowerStage} size="md" className="mb-2" />
              <span className="text-xs font-bold text-[#233125] font-serif">
                {t(msg.flowerStage.phaseNameKh, msg.flowerStage.phaseNameEn)}
              </span>
              <span className="text-[11px] text-[#5F6E60] mt-0.5">
                {t(`ខែទី ${msg.month}`, `Month ${msg.month}`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Core Experience Pillars */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#233125]">
            {t('«ម៉ែ» នៅក្បែរអ្នកគ្រប់ពេលវេលា', 'How ម៉ែ Cares for You')}
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6E60] mt-1">
            {t('បទពិសោធន៍ដ៏កក់ក្តៅ និងសាមញ្ញបំផុតសម្រាប់ស្រ្តីខ្មែរ។', 'A warm, simple experience designed specifically for Cambodian mothers.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F0F4E8] flex items-center justify-center text-[#5C7034]">
              <Headphones className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#233125]">
              🌸 {t('សារសំឡេងប្រចាំខែ', 'Monthly Voice Message')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'ស្តាប់សារសំឡេងប្រចាំខែដ៏ទន់ភ្លន់ ដែលនាំមកនូវភាពស្ងប់ចិត្ត និងទំនុកចិត្ត។',
                'A gentle monthly voice message that brings calm and reassurance.'
              )}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF1E4] flex items-center justify-center text-[#88A04D]">
              <Calendar className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#233125]">
              📝 {t('អ្វីដែលអ្នកអាចយកចិត្តទុកដាក់', 'Simple Stage Focus')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'ចំណុចផ្តោតសំខាន់ៗមួយចំនួនតូច៖ អាហារូបត្ថម្ភ ការពិនិត្យសុខភាព និងការថែទាំខ្លួន។',
                'Only a few small, clear topics to focus on right now without overwhelm.'
              )}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E5EADF] shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#DDE8F1]/60 flex items-center justify-center text-[#233125]">
              <ShieldCheck className="w-5 h-5 text-[#5C7034]" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#233125]">
              🔎 {t('ស្វែងយល់ពីប្រភពពិត', 'Curated & Trusted')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'ដកស្រង់ចេញពីក្រសួងសុខាភិបាលកម្ពុជា (NMCHC) WHO និង UNICEF យ៉ាងត្រឹមត្រូវ។',
                'Evidence-based information directly from health authorities.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Pre-Login Onboarding Wizard & Due Date Calculator */}
      <PreLoginWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};