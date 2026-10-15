/**
 * ម៉ែ — by FlowErs
 * My Plan Screen (គម្រោងរបស់ខ្ញុំ)
 *
 * Premium Split:
 * - Free: All summaries, search, stage guides, and voice messages.
 * - Premium (is_premium === true): Full My Plan features (daily/weekly checklist, reminders, Telegram alerts).
 * - Non-premium users see a friendly Upgrade Preview with an "Ask for access" action (no payments).
 * - Manually enabled by admin in Supabase Table Editor.
 */

import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Compass,
  Send,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePlan } from '../context/PlanContext';
import { PlanItemCard } from '../components/PlanItemCard';
import { TelegramLink } from '../components/TelegramLink';
import { FeedbackCard } from '../components/FeedbackCard';

export const PlanScreen: React.FC = () => {
  const { setActiveTab, isPremium, setIsUpgradeModalOpen, currentWeek, logEvent, showToast, t } = useApp();
  const { items, getDueToday, getThisWeekItems, getDoneItems, todayDateStr } = usePlan();

  const dueToday = getDueToday();
  const thisWeek = getThisWeekItems();
  const doneItems = getDoneItems();

  const [activeSection, setActiveSection] = useState<'today' | 'week' | 'done'>('today');

  // Calendar Export (iCalendar .ics format) - Premium feature
  const handleExportCalendar = () => {
    if (!isPremium) {
      setIsUpgradeModalOpen(true);
      return;
    }

    if (items.length === 0) {
      showToast(
        t(
          'មិនទាន់មានការងារក្នុងគម្រោងសម្រាប់នាំចេញទេ សូមជ្រើសរើសការណែនាំពីអត្ថបទ ឬសារសំឡេងជាមុនសិន 🌸',
          'No plan items to export yet. Add suggestions from resources first 🌸'
        )
      );
      return;
    }

    const formatIcsDate = (dateStr: string, timeStr = '08:00') => {
      const [year, month, day] = dateStr.split('-');
      const [hour, minute] = timeStr.split(':');
      return `${year}${month}${day}T${hour || '08'}${minute || '00'}00`;
    };

    const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const events = items
      .map((item, index) => {
        const dtStart = formatIcsDate(item.start_date, item.reminder_time);
        const dtEnd = formatIcsDate(item.end_date || item.start_date, item.reminder_time);
        const title = (item.text_kh || item.text_en || 'Plan Item').replace(/[\r\n]+/g, ' ');
        const desc = `ម៉ែ by FlowErs · ${item.source_type === 'voice_message' ? 'From Monthly Voice Message' : 'From Verified Health Resource'}`;

        return [
          'BEGIN:VEVENT',
          `UID:mae-item-${item.id || index}-${Date.now()}@flowers.cambodia`,
          `DTSTAMP:${nowStr}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:${title}`,
          `DESCRIPTION:${desc}`,
          'STATUS:CONFIRMED',
          'BEGIN:VALARM',
          'TRIGGER:-PT15M',
          'ACTION:DISPLAY',
          `DESCRIPTION:Reminder: ${title}`,
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n');
      })
      .join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FlowErs//Mae Pregnancy Companion//KM',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:ម៉ែ (Mae) - My Pregnancy Plan',
      events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mae-pregnancy-plan-${todayDateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logEvent('calendar_exported', undefined, currentWeek, { count: items.length });
    showToast(t('បានទាញយកឯកសារប្រតិទិន (.ics) រួចរាល់ 🌸', 'Calendar (.ics) exported successfully 🌸'));
  };

  // Non-premium users: Friendly Upgrade Showcase Screen
  if (!isPremium) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-fade-in">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-b from-[#EBF1E4]/90 via-[#FAF9F5] to-white border border-[#E5EADF] p-5 sm:p-7 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#88A04D]" />
            <span>{t('មុខងារពិសេស · My Plan Premium', 'Exclusive Feature · My Plan')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125] tracking-tight">
            {t('គម្រោងថែទាំសុខភាពផ្ទាល់ខ្លួន 🌸', 'Personalized Daily Plan 🌸')}
          </h1>

          <p className="text-xs sm:text-sm text-[#5F6E60] pt-1 leading-relaxed">
            {t(
              'រៀបចំកាលវិភាគថែទាំសុខភាពផ្ទាល់ខ្លួន ទទួលសាររំលឹកកិច្ចការប្រចាំថ្ងៃ និងភ្ជាប់ការរំលឹកតាម Telegram យ៉ាងងាយស្រួល។',
              'Organize your daily self-care routine, receive gentle reminders, and sync with Telegram.'
            )}
          </p>

          <div className="mt-5 pt-4 border-t border-[#E5EADF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-[#5C7034] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#88A04D]" />
              <span>{t('អត្ថបទនិងសារសំឡេងទាំងអស់គឺឥតគិតថ្លៃ ១០០%', 'All summaries & audio messages remain 100% free')}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('ដំឡើងគម្រោង / ភ្ជាប់ Telegram 🌸', 'Purchase / Upgrade Plan 🌸')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Cards Showcase (Interactive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] hover:border-[#88A04D]/60 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-[#5C7034] group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-sm font-bold text-[#233125] group-hover:text-[#5C7034] transition-colors">
              {t('កាលវិភាគថែទាំខ្លួនប្រចាំថ្ងៃ', 'Personal Daily Checklist')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'បញ្ចូលការណែនាំពីអត្ថបទ និងសារសំឡេង ទៅក្នុងកាលវិភាគដើម្បីងាយស្រួលអនុវត្ត។',
                'Add recommendations from resources and voice notes directly into your routine.'
              )}
            </p>
          </div>

          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] hover:border-[#88A04D]/60 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#CAD6BE] flex items-center justify-center text-[#5C7034] group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-sm font-bold text-[#233125] group-hover:text-[#5C7034] transition-colors">
              {t('សាររំលឹកតាម Telegram ម៉ោង ៨ ព្រឹក', 'Daily 8:00 AM Telegram Alerts')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'Telegram ផ្ញើសាររំលឹកការងារដែលត្រូវធ្វើរៀងរាល់ព្រឹក ដោយមិនបាច់បើកកម្មវិធី។',
                'Wake up to one calm morning message with your tasks due that day.'
              )}
            </p>
          </div>

          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] hover:border-[#88A04D]/60 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#CAD6BE] flex items-center justify-center text-[#5C7034] group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-sm font-bold text-[#233125] group-hover:text-[#5C7034] transition-colors">
              {t('រំលឹកលេបថ្នាំជាតិដែក និងអាហារូបត្ថម្ភ', 'Supplements & Antenatal Care')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'កុំឱ្យភ្លេចលេបថ្នាំជាតិដែក អាស៊ីតហ្វូលិក និងការណាត់ជួបគ្រូពេទ្យ ឬឆ្មប។',
                'Stay on track with iron/folate tablets and official health visits.'
              )}
            </p>
          </div>

          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5EADF] hover:border-[#88A04D]/60 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#CAD6BE] flex items-center justify-center text-[#5C7034] group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-[#88A04D]" />
            </div>
            <h3 className="text-sm font-bold text-[#233125] group-hover:text-[#5C7034] transition-colors">
              {t('ការនាំចេញទៅកាន់ប្រតិទិនទូរស័ព្ទ', 'Calendar Sync & Export')}
            </h3>
            <p className="text-xs text-[#5F6E60] leading-relaxed">
              {t(
                'រក្សាទុកការណាត់ជួប និងការងារសំខាន់ៗទៅក្នុងប្រតិទិនទូរស័ព្ទរបស់អ្នក។',
                'Export scheduled antenatal visits directly into your phone calendar.'
              )}
            </p>
          </div>
        </div>

        {/* Tester Guidance Note */}
        <div className="p-4 rounded-3xl bg-white border border-[#E5EADF] text-xs text-[#5F6E60] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="font-bold text-[#233125] block mb-0.5">
              {t('សម្រាប់អ្នកចូលរួមសាកល្បងកម្មវិធី (Beta Testers)៖', 'For Beta Testers:')}
            </span>
            <span>
              {t(
                'ក្រុមការងារអាចបើកសិទ្ធិប្រើប្រាស់ពេញលេញ (is_premium) ដោយផ្ទាល់ជូនអ្នកក្នុងប្រព័ន្ធទិន្នន័យ Supabase ដោយមិនគិតថ្លៃឡើយ។',
                'Our team enables is_premium directly in Supabase for testing accounts without charging any payments.'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="min-h-[40px] px-4 py-2 rounded-full border border-[#88A04D]/40 text-[#5C7034] font-semibold hover:bg-[#EBF1E4] transition-colors shrink-0"
          >
            {t('ដំឡើងគម្រោង / ភ្ជាប់ Telegram', 'Purchase / Upgrade Plan')}
          </button>
        </div>
      </div>
    );
  }

  // Premium users: Full My Plan Screen
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-fade-in">
      {/* Screen Header */}
      <div className="rounded-3xl bg-gradient-to-b from-[#EBF1E4]/90 via-[#FAF9F5] to-white border border-[#E5EADF] p-5 sm:p-7 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs mb-2">
          <CalendarCheck className="w-3.5 h-3.5 text-[#88A04D]" />
          <span>{t('គម្រោងថែទាំខ្លួនរបស់ខ្ញុំ', 'My Gentle Plan')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125] tracking-tight">
          {t('គម្រោងរបស់ខ្ញុំ 🌸', 'My Plan 🌸')}
        </h1>

        <p className="text-xs sm:text-sm text-[#5F6E60] pt-1 leading-relaxed">
          {t(
            'កត់ត្រាការណែនាំថែទាំសុខភាពសាមញ្ញៗដែលអ្នកជ្រើសរើសចេញពីសារសំឡេង ឬអត្ថបទ។ គ្មានសម្ពាធ គ្មានការបង្ខិតបង្ខំ។',
            'Pre-written suggestions you chose from voice messages and articles. No pressure, no rush.'
          )}
        </p>

        {/* Date badge & Calendar Export Action */}
        <div className="mt-4 pt-3 border-t border-[#E5EADF]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5F6E60]">
          <div className="flex items-center gap-3">
            <span>{t(`កាលបរិច្ឆេទនៅកម្ពុជា៖ ${todayDateStr}`, `Cambodia date: ${todayDateStr}`)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#5C7034]">
              {t(`នៅសល់ថ្ងៃនេះ៖ ${dueToday.length} ការងារ`, `Today: ${dueToday.length} due`)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleExportCalendar}
            className="min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#EBF1E4] border border-[#CAD6BE] text-[#5C7034] hover:text-[#233125] font-semibold text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
            title={t('នាំចេញកាលវិភាគទៅកាន់ប្រតិទិនទូរស័ព្ទ', 'Export schedule to phone calendar')}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('នាំចេញប្រតិទិន (.ics)', 'Export to Calendar (.ics)')}</span>
          </button>
        </div>
      </div>

      {/* Segment Tabs: Today / This Week / Done */}
      <div className="flex items-center gap-2 p-1 bg-[#F0F4E8]/60 rounded-2xl border border-[#E5EADF]">
        <button
          type="button"
          onClick={() => setActiveSection('today')}
          className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'today'
              ? 'bg-white text-[#233125] shadow-xs'
              : 'text-[#5F6E60] hover:text-[#233125]'
          }`}
        >
          <span>{t('ថ្ងៃនេះ', 'Today')}</span>
          <span className="w-5 h-5 rounded-full bg-[#EBF1E4] text-[#5C7034] text-[11px] font-bold flex items-center justify-center">
            {dueToday.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('week')}
          className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'week'
              ? 'bg-white text-[#233125] shadow-xs'
              : 'text-[#5F6E60] hover:text-[#233125]'
          }`}
        >
          <span>{t('សប្ដាហ៍នេះ', 'This Week')}</span>
          <span className="w-5 h-5 rounded-full bg-[#EBF1E4] text-[#5C7034] text-[11px] font-bold flex items-center justify-center">
            {thisWeek.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('done')}
          className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === 'done'
              ? 'bg-white text-[#233125] shadow-xs'
              : 'text-[#5F6E60] hover:text-[#233125]'
          }`}
        >
          <span>{t('បានបញ្ចប់', 'Done')}</span>
          <span className="w-5 h-5 rounded-full bg-[#EBF1E4] text-[#5C7034] text-[11px] font-bold flex items-center justify-center">
            {doneItems.length}
          </span>
        </button>
      </div>

      {/* Section Content */}
      <div className="space-y-3">
        {activeSection === 'today' && (
          <>
            {dueToday.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-white border border-[#E5EADF] text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center mx-auto text-xl">
                  🌸
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-[#233125]">
                    {t('គ្មានការងារដែលត្រូវធ្វើសម្រាប់ថ្ងៃនេះទេ', 'Nothing Due Today')}
                  </h3>
                  <p className="text-xs text-[#5F6E60] max-w-sm mx-auto leading-relaxed">
                    {t(
                      'សម្រាកឱ្យស្រួលចិត្តណា៎! អ្នកអាចស្វែងរកអត្ថបទសុខភាពដើម្បីជ្រើសរើសការណែនាំថ្មីៗ។',
                      'Rest easy, Mama! You can browse gentle tips anytime you feel ready.'
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('explore')}
                    className="min-h-[40px] px-4 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs font-semibold shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t('ស្វែងរកអត្ថបទសុខភាព', 'Explore Articles')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dueToday.map((item) => (
                  <PlanItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}

        {activeSection === 'week' && (
          <>
            {thisWeek.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-white border border-[#E5EADF] text-center space-y-2 text-xs text-[#5F6E60]">
                <p>{t('មិនទាន់មានគម្រោងសកម្មសម្រាប់សប្ដាហ៍នេះទេ។', 'No active reminders for this week.')}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {thisWeek.map((item) => (
                  <PlanItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}

        {activeSection === 'done' && (
          <>
            {doneItems.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-white border border-[#E5EADF] text-center space-y-2 text-xs text-[#5F6E60]">
                <p>{t('មិនទាន់មានការងារដែលបានបញ្ចប់នៅឡើយទេ។', 'No completed items yet.')}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {doneItems.map((item) => (
                  <PlanItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Telegram Daily Reminders Integration */}
      <section>
        <TelegramLink />
      </section>

      {/* Feature Feedback Card for My Plan */}
      {items.length > 0 && <FeedbackCard feature="my_plan" />}
    </div>
  );
};
