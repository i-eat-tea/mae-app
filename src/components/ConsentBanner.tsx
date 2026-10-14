/**
 * ម៉ែ — by FlowErs
 * Research Consent & Data Privacy Banner
 *
 * Explains clearly and transparently:
 * - What is collected: pages opened, articles marked read, audio listening duration, plan activity
 * - Purpose: strictly for research to improve the app
 * - Audience: seen only by the research team [TEAM NAME]
 * - Rights: optional; mother can delete data anytime in Profile
 * - Contact: [CONTACT]
 */

import React from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConsentBanner: React.FC = () => {
  const { analyticsConsent, setAnalyticsConsent, t } = useApp();

  // If user already answered (granted or denied), hide the banner
  if (analyticsConsent !== 'unset') return null;

  return (
    <aside
      aria-label="Research and Data Privacy Consent"
      className="fixed bottom-18 md:bottom-5 left-1/2 -translate-x-1/2 z-45 w-[94%] max-w-xl p-4 sm:p-5 rounded-3xl bg-[#FAF9F5]/98 backdrop-blur-md border border-[#88A04D]/40 shadow-2xl animate-slide-up"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-[#5C7034] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-[#88A04D]" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold font-serif text-[#233125]">
              🌸 {t('ការចូលរួមក្នុងការស្រាវជ្រាវ និងភាពឯកជន', 'Research Consent & Privacy')}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF1E4] text-[#5C7034]">
              {t('ស្រេចចិត្ត', 'Optional')}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#5F6E60] leading-relaxed">
            {t(
              'ដើម្បីជួយកែលម្អកម្មវិធី «ម៉ែ» ឱ្យកាន់តែប្រសើរឡើងសម្រាប់ស្រ្តីខ្មែរ ក្រុមការងារស្រាវជ្រាវ [TEAM NAME] សុំការអនុញ្ញាតកត់ត្រាសកម្មភាពមួយចំនួន៖ ទំព័រនិងអត្ថបទដែលអ្នកបើកអាន ចំនួនអត្ថបទដែលបានសម្គាល់ថាបានអាន រយៈពេលស្តាប់សារសំឡេង និងសកម្មភាពក្នុងគម្រោង (My Plan)។',
              'To help improve the ម៉ែ companion, the [TEAM NAME] research team requests your permission to collect limited activity: pages and articles you view, articles marked as read, audio listening duration, and plan activity.'
            )}
          </p>

          <p className="text-[11px] sm:text-xs text-[#233125]/85 bg-white p-2.5 rounded-xl border border-[#E5EADF] leading-relaxed">
            {t(
              'ទិន្នន័យនេះប្រើសម្រាប់តែការស្រាវជ្រាវកែលម្អកម្មវិធីប៉ុណ្ណោះ ឃើញតែក្រុមស្រាវជ្រាវ [TEAM NAME] និងមិនចែករំលែកជាសាធារណៈឡើយ។ អ្នកអាចលុបទិន្នន័យរបស់អ្នកចេញពីប្រព័ន្ធវិញបានគ្រប់ពេលក្នុងទំព័រ «គណនី» (Profile)។ ទំនាក់ទំនង៖ [CONTACT]',
              'This data is used strictly for research to improve the app, is seen only by the research team [TEAM NAME], and will never be shared publicly. You can delete all your data at any time from your Profile screen. Questions or contact: [CONTACT]'
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setAnalyticsConsent('granted')}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t('យល់ព្រម (I Agree)', 'I Agree')}</span>
            </button>

            <button
              type="button"
              onClick={() => setAnalyticsConsent('denied')}
              className="min-h-[44px] px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#E5EADF] text-[#5F6E60] hover:text-[#233125] text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>{t('មិនយល់ព្រម', 'Decline')}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
