/**
 * ម៉ែ — by FlowErs
 * Visual Reading Progress Tracker Component
 *
 * Displays a warm, botanical visual tracker showing how many trusted
 * pregnancy articles the mother has read, encouraging consistent learning.
 */

import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ResourceProgressTrackerProps {
  readFilter: 'all' | 'unread' | 'read';
  setReadFilter: (filter: 'all' | 'unread' | 'read') => void;
}

export const ResourceProgressTracker: React.FC<ResourceProgressTrackerProps> = ({
  readFilter,
  setReadFilter,
}) => {
  const { resources, readResourceIds, resetReadProgress, t } = useApp();

  const totalCount = resources.length;
  const readCount = readResourceIds.filter((id) =>
    resources.some((r) => r.id === id)
  ).length;
  const unreadCount = Math.max(0, totalCount - readCount);
  const percentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  // Encouraging microcopy in Khmer & English
  const getEncouragement = () => {
    if (readCount === 0) {
      return {
        badgeKh: '🌸 ការចាប់ផ្តើមដ៏ទន់ភ្លន់',
        badgeEn: '🌸 Gentle Start',
        messageKh: 'ចាប់ផ្ដើមដំណើរ ការរុករក។ ការអានការណែនាំសូម្បីតែមួយអត្ថបទ ក៏នាំមកនូវភាពស្ងប់ចិត្តដល់អ្នកបានដែរ។',
        messageEn: 'Begin your gentle learning journey, Mama. Even reading one small guide brings calm and clarity to your day.',
      };
    }
    if (readCount < 4) {
      return {
        badgeKh: '🌱 ចាប់ផ្ដើមចាក់ឫស',
        badgeEn: '🌱 Taking Root',
        messageKh: 'ដូចគ្រាប់ពូជចាប់ផ្ដើមចាក់ឫស! រាល់ចំណេះដឹងដែលអ្នកអាន ជួយកសាងទំនុកចិត្តក្នុងចិត្តអ្នក។',
        messageEn: 'A tender seed taking root! Every small piece of trusted wisdom strengthens your quiet confidence.',
      };
    }
    if (readCount < 8) {
      return {
        badgeKh: '🌿 ពន្លកបៃតងលូតលាស់',
        badgeEn: '🌿 Gentle Sprout',
        messageKh: 'អ្នកកំពុងថែបំប៉នខ្លួនឯងនិងទារកដោយចំណេះដឹងទូទៅផ្នែកសុខភាព។',
        messageEn: 'You are nurturing yourself and your baby with trusted maternal wisdom. Keep taking it one gentle week at a time.',
      };
    }
    return {
      badgeKh: '💐 ផ្ការីកពេញទំហឹង',
      badgeEn: '💐 Full Bloom Mama',
      messageKh: 'អស្ចារ្យណាស់! អ្នកបានស្វែងយល់ការណែនាំសុខភាពជាច្រើន។ អ្នកកំពុងដើរលើវិថីមាតុភាពនេះដោយចំណេះដឹងនិងសេចក្តីស្ងប់។',
      messageEn: 'Wonderful milestone! You have explored many trusted guides with peace and knowledge.',
    };
  };

  const encouragement = getEncouragement();

  const milestones = [
    { count: 1, labelKh: 'ជំហានដំបូង', labelEn: 'First Step', icon: '🌱' },
    { count: 3, labelKh: 'ពន្លក', labelEn: 'Sprout', icon: '🌿' },
    { count: 6, labelKh: 'ពាក់កណ្តាល', labelEn: 'Halfway', icon: '🌸' },
    { count: 10, labelKh: 'រីកស្គុះស្គាយ', labelEn: 'Full Bloom', icon: '💐' },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#EBF1E4]/70 via-[#FAF9F5] to-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Banner with Progress & Encouragement */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="space-y-2 text-center sm:text-left max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#88A04D]" />
            <span>{t(encouragement.badgeKh, encouragement.badgeEn)}</span>
            <span aria-hidden="true">·</span>
            <span>{percentage}% {t('បានអាន', 'Completed')}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#233125]">
            {t(`ការអានរបស់អ្នក៖ បានអាន ${readCount} ក្នុងចំណោម ${totalCount} អត្ថបទ`, `Your Reading Journey: ${readCount} of ${totalCount} Articles Read`)}
          </h2>

          <p className="text-xs sm:text-sm text-[#233125]/85 leading-relaxed italic">
            “{t(encouragement.messageKh, encouragement.messageEn)}”
          </p>
        </div>

        {/* Circular Floral Progress Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#DDE8F1"
              strokeWidth="7"
              fill="transparent"
              className="opacity-70"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#88A04D"
              strokeWidth="7.5"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold font-serif text-[#233125] font-mono leading-none">
              {readCount}/{totalCount}
            </span>
            <span className="text-[10px] text-[#5F6E60] font-medium mt-0.5">
              {t('បានអាន', 'Read')}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar with Milestone Markers */}
      <div className="space-y-2 pt-1">
        <div className="relative w-full h-3 bg-[#E5EADF] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#88A04D] to-[#5C7034] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-4 gap-1 pt-1 text-center">
          {milestones.map((m) => {
            const isUnlocked = readCount >= m.count;
            return (
              <div
                key={m.count}
                className={`flex flex-col items-center transition-all ${
                  isUnlocked ? 'text-[#233125]' : 'text-[#5F6E60]/60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 border transition-all ${
                    isUnlocked
                      ? 'bg-white border-[#88A04D] text-[#88A04D] shadow-2xs font-bold scale-105'
                      : 'bg-[#FAF9F5] border-[#E5EADF] grayscale opacity-70'
                  }`}
                >
                  {m.icon}
                </div>
                <span className="text-[10px] font-medium hidden sm:inline">
                  {t(m.labelKh, m.labelEn)}
                </span>
                <span className="text-[9px] font-mono text-[#5F6E60]">
                  {m.count} {t('អត្ថបទ', 'art')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs by Reading Status */}
      <div className="pt-3 border-t border-[#E5EADF]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] rounded-2xl border border-[#E5EADF]">
          <button
            type="button"
            onClick={() => setReadFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              readFilter === 'all'
                ? 'bg-white text-[#233125] font-semibold shadow-2xs border border-[#88A04D]/30'
                : 'text-[#5F6E60] hover:text-[#233125]'
            }`}
          >
            {t(`ឯកសារទាំងអស់ (${totalCount})`, `All (${totalCount})`)}
          </button>

          <button
            type="button"
            onClick={() => setReadFilter('unread')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              readFilter === 'unread'
                ? 'bg-white text-[#233125] font-semibold shadow-2xs border border-[#88A04D]/30'
                : 'text-[#5F6E60] hover:text-[#233125]'
            }`}
          >
            {t(`មិនទាន់អាន (${unreadCount})`, `To Read (${unreadCount})`)}
          </button>

          <button
            type="button"
            onClick={() => setReadFilter('read')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              readFilter === 'read'
                ? 'bg-white text-[#5C7034] font-semibold shadow-2xs border border-[#88A04D]/30'
                : 'text-[#5F6E60] hover:text-[#233125]'
            }`}
          >
            {t(`បានអានរួច (${readCount})`, `Read (${readCount})`)}
          </button>
        </div>

        {readCount > 0 && (
          <button
            type="button"
            onClick={resetReadProgress}
            className="text-[11px] text-[#5F6E60] hover:text-red-600 flex items-center gap-1 transition-colors"
            title="Reset reading history"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('កំណត់ប្រវត្តិឡើងវិញ', 'Reset progress')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
