/**
 * ម៉ែ — by FlowErs
 * Journey Screen: "ដំណើររបស់អ្នក"
 *
 * Provides a gentle, exploratory week-by-week and month-by-month journey:
 * 1. Month chips (1 to 9) with exact ranges:
 *    1: 1-4, 2: 5-8, 3: 9-12, 4: 13-16, 5: 17-20, 6: 21-24, 7: 25-28, 8: 29-34, 9: 35-40
 * 2. When a month is selected, shows its week chips underneath (thumb-sized, scrollable sideways on 360px phones).
 * 3. Separate "viewedWeek" state defaulting to the user's pregnancy week.
 *    Selecting a week changes ONLY viewedWeek, never the saved profile week.
 *    Shows "Back to my week" button and a small marker on user's real pregnancy week.
 * 4. Shows:
 *    - Flower visual & Fruit size for viewedWeek
 *    - Articles whose pregnancyWeeks include viewedWeek (hidden if empty)
 *    - Monthly voice message
 *    - Focus topics if exist (hidden if empty)
 * 5. Logs week_viewed with metadata { week, month } through logEvent.
 * 6. Khmer-first, English second, mobile-first.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Calendar,
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BabyGrowthCard } from '../components/BabyGrowthCard';
import { AudioPlayer } from '../components/AudioPlayer';
import { TopicCard } from '../components/TopicCard';
import { ResourceCard } from '../components/ResourceCard';
import {
  MONTHLY_MOM_MESSAGES,
  getFocusTopicsForMonth,
  getMonthlyMessageForWeek,
} from '../data/monthlyMessages';

interface MonthRange {
  month: number;
  labelKh: string;
  labelEn: string;
  startWeek: number;
  endWeek: number;
  weeks: number[];
}

const MONTH_RANGES: MonthRange[] = [
  { month: 1, labelKh: 'ខែទី ១', labelEn: 'Month 1', startWeek: 1, endWeek: 4, weeks: [1, 2, 3, 4] },
  { month: 2, labelKh: 'ខែទី ២', labelEn: 'Month 2', startWeek: 5, endWeek: 8, weeks: [5, 6, 7, 8] },
  { month: 3, labelKh: 'ខែទី ៣', labelEn: 'Month 3', startWeek: 9, endWeek: 12, weeks: [9, 10, 11, 12] },
  { month: 4, labelKh: 'ខែទី ៤', labelEn: 'Month 4', startWeek: 13, endWeek: 16, weeks: [13, 14, 15, 16] },
  { month: 5, labelKh: 'ខែទី ៥', labelEn: 'Month 5', startWeek: 17, endWeek: 20, weeks: [17, 18, 19, 20] },
  { month: 6, labelKh: 'ខែទី ៦', labelEn: 'Month 6', startWeek: 21, endWeek: 24, weeks: [21, 22, 23, 24] },
  { month: 7, labelKh: 'ខែទី ៧', labelEn: 'Month 7', startWeek: 25, endWeek: 28, weeks: [25, 26, 27, 28] },
  { month: 8, labelKh: 'ខែទី ៨', labelEn: 'Month 8', startWeek: 29, endWeek: 34, weeks: [29, 30, 31, 32, 33, 34] },
  { month: 9, labelKh: 'ខែទី ៩', labelEn: 'Month 9', startWeek: 35, endWeek: 40, weeks: [35, 36, 37, 38, 39, 40] },
];

function getMonthForWeek(week: number): number {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 12) return 3;
  if (week <= 16) return 4;
  if (week <= 20) return 5;
  if (week <= 24) return 6;
  if (week <= 28) return 7;
  if (week <= 34) return 8;
  return 9;
}

export const JourneyScreen: React.FC = () => {
  const { currentWeek, resources, logEvent, t } = useApp();

  // Task 3: Separate viewedWeek state defaulting to user's saved pregnancy week
  const [viewedWeek, setViewedWeek] = useState<number>(() => currentWeek || 9);

  // Month currently selected in the picker (defaults to month of viewedWeek)
  const [selectedMonth, setSelectedMonth] = useState<number>(() => getMonthForWeek(currentWeek || 9));

  // Sync if profile week updates externally, but keep user's browsing if already mounted
  useEffect(() => {
    // If viewedWeek was not set yet, initialize to currentWeek
    if (!viewedWeek) {
      setViewedWeek(currentWeek);
      setSelectedMonth(getMonthForWeek(currentWeek));
    }
  }, [currentWeek]);

  // Task 5: Log week_viewed event with metadata { week, month }
  useEffect(() => {
    logEvent('week_viewed', undefined, viewedWeek, {
      week: viewedWeek,
      month: selectedMonth,
      is_user_real_week: viewedWeek === currentWeek,
    });
  }, [viewedWeek, selectedMonth]);

  // Find range config for selected month
  const activeMonthConfig = useMemo(() => {
    return MONTH_RANGES.find((m) => m.month === selectedMonth) || MONTH_RANGES[2];
  }, [selectedMonth]);

  // Active monthly message for the viewed week / month
  const activeMessage = useMemo(() => {
    return MONTHLY_MOM_MESSAGES[selectedMonth - 1] || getMonthlyMessageForWeek(viewedWeek);
  }, [selectedMonth, viewedWeek]);

  // Focus topics for this month/stage
  const activeFocusTopics = useMemo(() => {
    return getFocusTopicsForMonth(selectedMonth);
  }, [selectedMonth]);

  // Task 4: Articles whose pregnancyWeeks include viewedWeek (hidden if empty)
  const matchingArticles = useMemo(() => {
    return resources.filter(
      (r) => Array.isArray(r.pregnancyWeeks) && r.pregnancyWeeks.includes(viewedWeek)
    );
  }, [resources, viewedWeek]);

  // Handle Month Selection: updates selectedMonth and sets viewedWeek to the start of that month (or stays if already in range)
  const handleSelectMonth = (monthNumber: number) => {
    setSelectedMonth(monthNumber);
    const range = MONTH_RANGES.find((m) => m.month === monthNumber);
    if (range) {
      // If viewedWeek is outside this month's range, pick the first week of this month
      if (viewedWeek < range.startWeek || viewedWeek > range.endWeek) {
        setViewedWeek(range.startWeek);
      }
    }
  };

  // Handle Week Selection: changes ONLY viewedWeek, NEVER currentWeek
  const handleSelectWeek = (weekNumber: number) => {
    setViewedWeek(weekNumber);
    const derivedMonth = getMonthForWeek(weekNumber);
    if (derivedMonth !== selectedMonth) {
      setSelectedMonth(derivedMonth);
    }
  };

  // Task 3: "Back to my week" reset action
  const handleResetToMyWeek = () => {
    setViewedWeek(currentWeek);
    setSelectedMonth(getMonthForWeek(currentWeek));
  };

  const isBrowsingOtherWeek = viewedWeek !== currentWeek;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#88A04D] uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-[#88A04D]" />
          <span>{t('ដំណើររបស់អ្នក', 'Your Pregnancy Journey')}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125]">
            {t('ដំណើរ ៩ ខែ នៃមាតុភាព', 'Nine Months of Becoming a Mother')}
          </h1>

          {/* Task 3: "Back to my week" button (shown when viewing a different week) */}
          {isBrowsingOtherWeek && (
            <button
              type="button"
              onClick={handleResetToMyWeek}
              className="self-start sm:self-auto min-h-[40px] px-3.5 py-1.5 rounded-full bg-[#EBF1E4] hover:bg-[#88A04D] hover:text-white border border-[#88A04D]/35 text-xs font-bold text-[#5C7034] shadow-2xs inline-flex items-center gap-1.5 transition-all animate-fade-in"
              title={t('ត្រឡប់ទៅសប្ដាហ៍ពិតប្រាកដរបស់អ្នក', 'Return to your actual pregnancy stage')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t(`ត្រឡប់ទៅសប្ដាហ៍ទី ${currentWeek} វិញ`, `Back to my week (${currentWeek})`)}</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#5F6E60]">
          {t(
            'ជ្រើសរើសខែ និងសប្ដាហ៍នីមួយៗដើម្បីស្តាប់សារសំឡេង មើលទំហំទារក និងអានឯកសារពាក់ព័ន្ធ។',
            'Select any month and week to explore gentle voice guidance, baby growth, and relevant articles.'
          )}
        </p>
      </div>

      {/* Week & Month Picker Card */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Task 1: Month Chips (1 to 9) */}
        <div>
          <div className="flex items-center justify-between pb-2 text-xs text-[#5F6E60]">
            <span className="font-semibold text-[#233125]">
              {t('ជ្រើសរើសខែ (Month 1-9)', 'Select Month (1-9)')}
            </span>
            <span className="text-[11px] text-[#5C7034] font-medium">
              {t(`កំពុងមើល៖ សប្ដាហ៍ទី ${viewedWeek}`, `Viewing: Week ${viewedWeek}`)}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none">
            {MONTH_RANGES.map((range) => {
              const isSelected = selectedMonth === range.month;
              const containsUserWeek = currentWeek >= range.startWeek && currentWeek <= range.endWeek;

              return (
                <button
                  key={range.month}
                  type="button"
                  onClick={() => handleSelectMonth(range.month)}
                  className={`min-h-[44px] shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-[#88A04D] text-white border-[#88A04D] shadow-xs'
                      : 'bg-[#FAF9F5] text-[#5F6E60] border-[#E5EADF] hover:text-[#233125] hover:bg-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>🌸</span>
                  <span>{t(range.labelKh, range.labelEn)}</span>

                  {/* Task 3: Small marker indicating user's real pregnancy month */}
                  {containsUserWeek && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-white ring-2 ring-[#88A04D]' : 'bg-[#88A04D]'
                      }`}
                      title={t('ខែនៃការពពោះរបស់អ្នក', 'Your current pregnancy month')}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task 2: Week Chips Underneath (Thumb-sized, scrollable sideways on 360px phones) */}
        <div className="pt-3 border-t border-[#E5EADF]">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-[#5C7034] uppercase tracking-wider">
              {t(
                `សប្ដាហ៍ក្នុង${activeMonthConfig.labelKh} (${activeMonthConfig.startWeek} - ${activeMonthConfig.endWeek})`,
                `Weeks in ${activeMonthConfig.labelEn} (${activeMonthConfig.startWeek} - ${activeMonthConfig.endWeek})`
              )}
            </span>
            <span className="text-[11px] text-[#5F6E60]">
              {t('ចុចដើម្បីមើលព័ត៌មានលម្អិត', 'Tap to inspect')}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activeMonthConfig.weeks.map((weekNum) => {
              const isSelected = viewedWeek === weekNum;
              const isUserRealWeek = currentWeek === weekNum;

              return (
                <button
                  key={weekNum}
                  type="button"
                  onClick={() => handleSelectWeek(weekNum)}
                  className={`min-h-[46px] min-w-[58px] px-3 py-2 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all shrink-0 relative ${
                    isSelected
                      ? 'bg-[#233125] text-white border-[#233125] shadow-xs scale-[1.02]'
                      : 'bg-[#FAF9F5] text-[#233125] border-[#E5EADF] hover:bg-white hover:border-[#88A04D]'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Week ${weekNum}`}
                >
                  <span className="text-[11px] uppercase tracking-wider opacity-80 leading-none">
                    {t('សប្ដាហ៍', 'Wk')}
                  </span>
                  <span className="text-base font-mono leading-tight">{weekNum}</span>

                  {/* Task 3: Marker on the user's real week */}
                  {isUserRealWeek && (
                    <span
                      className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-[#88A04D] text-white text-[9px] font-bold shadow-2xs"
                      title={t('សប្ដាហ៍ពិតរបស់អ្នក', 'Your actual pregnancy week')}
                    >
                      {t('អ្នក', 'You')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Task 4: Flower Visual & Baby Fruit Size for the Viewed Week */}
      <section className="rounded-3xl bg-gradient-to-b from-[#EBF1E4]/90 via-[#FAF9F5] to-white border border-[#E5EADF] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-md">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs">
                {t(`សប្ដាហ៍ទី ${viewedWeek} · ខែទី ${selectedMonth}`, `Week ${viewedWeek} · Month ${selectedMonth}`)}
              </span>

              {viewedWeek === currentWeek ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#88A04D] text-white text-[11px] font-bold shadow-2xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t('សប្ដាហ៍បច្ចុប្បន្នរបស់អ្នក', 'Your current stage')}</span>
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-[#E5EADF] text-[#5F6E60] text-[11px]">
                  {t('របៀបមើលជាមុន', 'Preview mode')}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#233125]">
              {t(activeMessage.flowerStage.phaseNameKh, activeMessage.flowerStage.phaseNameEn)}
            </h2>

            <p className="text-xs sm:text-sm text-[#233125]/85 italic leading-relaxed pt-0.5">
              “{t(activeMessage.flowerStage.descriptionKh, activeMessage.flowerStage.descriptionEn)}”
            </p>
          </div>

          {/* Visuals: Unified Baby Growth Card (Flower Stage + Fruit Size) for viewedWeek */}
          <div className="w-full sm:w-[320px] md:w-[340px] shrink-0">
            <BabyGrowthCard week={viewedWeek} showDescription={false} />
          </div>
        </div>
      </section>

      {/* Task 4: Month's Voice Message */}
      <section>
        <AudioPlayer
          title={t(activeMessage.titleKh, activeMessage.titleEn)}
          subtitle={t('«មានសារតូចមួយសម្រាប់អ្នកក្នុងខែនេះ»', '"A short message for you this month"')}
          transcript={t(activeMessage.audioScriptKh, activeMessage.audioScriptEn)}
          letter={t(activeMessage.letterKh || '', activeMessage.letterEn || '')}
          audioUrl={activeMessage.audioUrl}
          durationStr={activeMessage.audioDuration}
          monthOrWeek={selectedMonth}
        />
      </section>

      {/* Task 4: Week Focus Topics (Hidden if empty) */}
      {activeFocusTopics && activeFocusTopics.length > 0 && (
        <section className="space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#233125]">
                {t(`អ្វីដែលអ្នកអាចយកចិត្តទុកដាក់ក្នុងខែទី ${selectedMonth}`, `Focus for Month ${selectedMonth}`)}
              </h3>
              <p className="text-xs text-[#5F6E60] mt-0.5">
                {t(
                  'រឿងសំខាន់ៗដែលត្រូវបានរៀបចំឡើងយ៉ាងស្ងប់ចិត្ត គ្មានសម្ពាធ។',
                  'Gentle, reassuring priorities for this stage.'
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeFocusTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {/* Task 4: Articles whose pregnancyWeeks include viewedWeek (Hidden if empty) */}
      {matchingArticles.length > 0 && (
        <section className="space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88A04D] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('ឯកសារណែនាំសម្រាប់សប្ដាហ៍នេះ', 'Guidance for This Week')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#233125] mt-0.5">
                {t(`អត្ថបទសុខភាពសម្រាប់សប្ដាហ៍ទី ${viewedWeek}`, `Health Articles for Week ${viewedWeek}`)} ({matchingArticles.length})
              </h3>
              <p className="text-xs text-[#5F6E60] mt-0.5">
                {t(
                  'ឯកសារសុខភាពផ្លូវការពីក្រសួងសុខាភិបាលកម្ពុជា WHO និង UNICEF ដែលត្រូវនឹងសប្ដាហ៍នេះ។',
                  'Trusted health protocols relevant to this exact week.'
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchingArticles.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
