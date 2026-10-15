/**
 * ម៉ែ — by FlowErs
 * Home Dashboard Screen
 *
 * Answers 3 things immediately:
 * 1. Where am I? ("អ្នកកំពុងស្ថិតនៅសប្ដាហ៍ទី ៩")
 * 2. What's my message this month? (Monthly voice message player)
 * 3. What can I focus on right now? ("អ្វីដែលអ្នកអាចយកចិត្តទុកដាក់" small focus cards)
 *
 * Voice: "ម៉ែ" (Mom) is the app's NAME only. The app speaks as a friendly
 * companion, never as the user's mother. Address the user as "you" (អ្នក),
 * never as "child" (កូន).
 */

import React, { useEffect } from 'react';
import { ChevronRight, Heart, CalendarCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePlan } from '../context/PlanContext';
import { BabyGrowthCard } from '../components/BabyGrowthCard';
import { AudioPlayer } from '../components/AudioPlayer';
import { TopicCard } from '../components/TopicCard';
import { LittleReminder } from '../components/LittleReminder';

export const HomeScreen: React.FC = () => {
  const { user, isPremium, currentWeek, currentMonth, monthlyMessage, focusTopics, setActiveTab, logEvent, t } = useApp();
  const { getDueToday, toggleDone } = usePlan();
  const dueToday = getDueToday();

  useEffect(() => {
    logEvent('monthly_message_played', monthlyMessage.id, currentWeek, { action: 'home_view' });
  }, [currentWeek, monthlyMessage.id]);

  const userName = user?.name ? user.name : t('អ្នកម្តាយ', 'Mama');

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. Where am I? */}
      <section className="rounded-3xl bg-gradient-to-b from-[#EBF1E4]/90 via-[#FAF9F5] to-white border border-[#E5EADF] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#88A04D] text-[#88A04D]" />
              <span>{t(`សួស្តី ${userName} 🌸`, `Hello, ${userName} 🌸`)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125] tracking-tight">
              {t(`អ្នកកំពុងស្ថិតនៅសប្ដាហ៍ទី ${currentWeek}`, `You're around Week ${currentWeek}`)}
            </h1>

            <p className="text-xs sm:text-sm text-[#5C7034] font-medium">
              {t(monthlyMessage.stageWeeks, `Month ${currentMonth} (${monthlyMessage.stageWeeks})`)} · {t(monthlyMessage.flowerStage.phaseNameKh, monthlyMessage.flowerStage.phaseNameEn)}
            </p>

            <p className="text-xs sm:text-sm text-[#233125]/85 italic pt-1 leading-relaxed">
              “{t(monthlyMessage.flowerStage.descriptionKh, monthlyMessage.flowerStage.descriptionEn)}”
            </p>
          </div>

          {/* Combined Baby Growth Card (Flower Stage + Cambodian Fruit Size) */}
          <div className="w-full sm:w-[320px] md:w-[340px] shrink-0">
            <BabyGrowthCard week={currentWeek} showDescription={false} />
          </div>
        </div>

        {/* Timeline shortcut */}
        <div className="mt-5 pt-4 border-t border-[#E5EADF]/80 flex items-center justify-between text-xs text-[#5F6E60]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#233125]">
              {t(`សប្ដាហ៍ទី ${currentWeek} ក្នុងចំណោម ៤០ សប្ដាហ៍`, `Week ${currentWeek} of 40`)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t(`នៅសល់ប្រហែល ${Math.max(0, 40 - currentWeek)} សប្ដាហ៍ទៀត`, `Approx. ${Math.max(0, 40 - currentWeek)} weeks to go`)}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className="inline-flex items-center gap-1 font-semibold text-[#88A04D] hover:text-[#5C7034] transition-colors"
          >
            <span>{t('មើលដំណើរទាំងមូល', 'View Journey')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Today's reminders strip (Premium feature) */}
      {isPremium && dueToday.length > 0 && (
        <section className="p-4 sm:p-5 rounded-3xl bg-white border border-[#88A04D]/35 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center shrink-0">
                <CalendarCheck className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#233125]">
                {t('ការរំលឹកសម្រាប់ថ្ងៃនេះ', "Today's Reminders")} ({dueToday.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('plan')}
              className="text-xs font-semibold text-[#88A04D] hover:text-[#5C7034] inline-flex items-center gap-1 transition-colors"
            >
              <span>{t('មើលគម្រោងទាំងអស់', 'View My Plan')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {dueToday.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleDone(item.id)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5EADF] text-xs text-[#233125] cursor-pointer hover:bg-white transition-colors"
              >
                <span className="w-4 h-4 rounded-md border border-[#CAD6BE] bg-white flex items-center justify-center shrink-0">
                  {item.done && <Check className="w-3 h-3 text-[#88A04D]" />}
                </span>
                <span className="truncate">{t(item.text_kh, item.text_en)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Monthly voice message */}
      <section>
        <AudioPlayer
          title={t(monthlyMessage.titleKh, monthlyMessage.titleEn)}
          subtitle={t('«មានសារតូចមួយសម្រាប់អ្នកក្នុងខែនេះ»', '"A short message for you this month"')}
          transcript={t(monthlyMessage.audioScriptKh, monthlyMessage.audioScriptEn)}
          letter={t(monthlyMessage.letterKh || '', monthlyMessage.letterEn || '')}
          audioUrl={monthlyMessage.audioUrl}
          durationStr={monthlyMessage.audioDuration}
          monthOrWeek={currentMonth}
        />
      </section>

      {/* 3. What can I focus on right now? (3 small focus cards) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#233125]">
              {t('អ្វីដែលអ្នកអាចយកចិត្តទុកដាក់', 'What You Can Focus on Right Now')}
            </h2>
            <p className="text-xs text-[#5F6E60] mt-0.5">
              {t('រឿងសំខាន់ៗមួយចំនួនតូចសម្រាប់សប្ដាហ៍នេះ ដោយមិនបាច់ខ្វល់ខ្វាយច្រើន។', 'A few gentle topics for this stage, keeping things simple.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* 4. A little reminder */}
      <section>
        <LittleReminder note={t(monthlyMessage.reminderKh, monthlyMessage.reminderEn)} />
      </section>
    </div>
  );
};