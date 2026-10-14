/**
 * ម៉ែ — by FlowErs
 * Explore / ស្វែងយល់ Screen
 *
 * Implements Section 7:
 * Curated, calm reference search experience.
 * Search bar placeholder: "តើមានអ្វីដែលអ្នកចង់ស្វែងយល់ដែរឬទេ?"
 * Displays verified results with Khmer title, short summary, category,
 * stage, trusted source, and link to original institutional source.
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResourceCard } from '../components/ResourceCard';
import { ResourceProgressTracker } from '../components/ResourceProgressTracker';

const CATEGORIES = [
  'ទាំងអស់ (All)',
  'អាហារូបត្ថម្ភ (Nutrition)',
  'ការពិនិត្យសុខភាព (Checkups)',
  'ការថែទាំរាងកាយនិងសុខភាពផ្លូវចិត្ត (Wellbeing)',
  'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)',
  'ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)',
];

export const ResourcesScreen: React.FC = () => {
  const {
    resources,
    setIsContentEntryOpen,
    setEditingResource,
    resetDefaultResources,
    isResourceRead,
    t,
    logEvent,
    currentWeek,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ទាំងអស់ (All)');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 2) {
      logEvent('search_performed', undefined, currentWeek, { query: e.target.value });
    }
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const q = searchQuery.toLowerCase().trim();

      // Search matching across Khmer & English fields
      const matchesSearch =
        !q ||
        (res.titleKh && res.titleKh.toLowerCase().includes(q)) ||
        (res.titleEn && res.titleEn.toLowerCase().includes(q)) ||
        (res.title && res.title.toLowerCase().includes(q)) ||
        (res.sourceName && res.sourceName.toLowerCase().includes(q)) ||
        (res.summaryKh && res.summaryKh.toLowerCase().includes(q)) ||
        (res.summaryEn && res.summaryEn.toLowerCase().includes(q)) ||
        (res.summary && res.summary.toLowerCase().includes(q));

      // Category matching
      const matchesCategory =
        selectedCategory === 'ទាំងអស់ (All)' ||
        res.category.includes(selectedCategory.split(' ')[0]) ||
        res.category === selectedCategory;

      // Read status matching
      const isRead = isResourceRead(res.id);
      const matchesRead =
        readFilter === 'all' ||
        (readFilter === 'read' && isRead) ||
        (readFilter === 'unread' && !isRead);

      return matchesSearch && matchesCategory && matchesRead;
    });
  }, [resources, searchQuery, selectedCategory, readFilter, isResourceRead]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#88A04D] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('ប្រភពចំណេះដឹងដែលអាចទុកចិត្តបាន', 'Curated Reference Library')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125]">
            {t('ស្វែងយល់', 'Explore')}
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6E60] mt-0.5">
            {t(
              'ព័ត៌មានសំខាន់ៗដែលជ្រើសរើសពីប្រភពដែលទុកចិត្តបាន ដូចជា ក្រសួងសុខាភិបាលកម្ពុជា WHO និង UNICEF។',
              'Carefully selected information from health authorities to learn at your own pace.'
            )}
          </p>
        </div>

        {/* Content Entry / Admin Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditingResource(null);
              setIsContentEntryOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('បញ្ចូលឯកសារថ្មី', 'Add Resource')}</span>
          </button>
        </div>
      </div>

      {/* Visual Reading Progress Tracker */}
      <ResourceProgressTracker
        readFilter={readFilter}
        setReadFilter={setReadFilter}
      />

      {/* Search and Filters Section */}
      <div className="rounded-3xl bg-white border border-[#E5EADF] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Simple Khmer-First Search Input (Section 7) */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('តើមានអ្វីដែលអ្នកចង់ស្វែងយល់ដែរឬទេ?', 'What would you like to explore?')}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D] focus:ring-1 focus:ring-[#88A04D]"
          />
          <Search className="w-4 h-4 text-[#5F6E60] absolute left-3.5 top-3.5" />
        </div>

        {/* Category Filters Bar */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6E60] mb-2">
            {t('ប្រភេទប្រធានបទ', 'Categories')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#88A04D] text-white font-semibold shadow-2xs'
                      : 'bg-[#FAF9F5] text-[#5F6E60] border border-[#E5EADF] hover:text-[#233125]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-[#5F6E60] px-1">
        <span>
          {t('បង្ហាញ', 'Showing')}{' '}
          <span className="font-semibold text-[#233125]">{filteredResources.length}</span>{' '}
          {t('ឯកសារដែលគួរអោយទុកចិត្ត', 'trusted resources')}
        </span>

        {(selectedCategory !== 'ទាំងអស់ (All)' || searchQuery || readFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ទាំងអស់ (All)');
              setSearchQuery('');
              setReadFilter('all');
            }}
            className="text-[#88A04D] hover:text-[#5C7034] font-medium"
          >
            {t('សម្អាតការរុករក', 'Clear filters')}
          </button>
        )}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E5EADF] p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-[#233125]">
            {t('រកមិនឃើញឯកសារត្រូវគ្នានឹងពាក្យស្វែងរកនេះទេ។', 'No resources found.')}
          </p>
          <p className="text-xs text-[#5F6E60]">
            {t('សូមសាកល្បងស្វែងរកដោយពាក្យផ្សេង ដូចជា «អាហារ» «ពិនិត្យ» ឬ «សម្រាល»។', 'Try searching for food, checkups, or delivery.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ទាំងអស់ (All)');
              setSearchQuery('');
              setReadFilter('all');
            }}
            className="px-4 py-2 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-xs font-medium text-[#233125]"
          >
            {t('កំណត់ឡើងវិញ', 'Reset search')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}

      {/* Team Info Strip */}
      <div className="rounded-2xl bg-[#F0F4E8]/60 border border-[#88A04D]/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6E60]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#88A04D]" />
          <span>
            {t(
              'ឯកសារទាំងអស់ត្រូវបានដកស្រង់ចេញពីក្រសួងសុខាភិបាលកម្ពុជា (NMCHC) WHO UNICEF និង RHAC។',
              'Curated directly from Cambodia MoH (NMCHC), WHO, UNICEF & RHAC.'
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={resetDefaultResources}
          className="text-xs text-[#5C7034] hover:text-[#233125] font-medium underline"
        >
          {t('កំណត់បញ្ជីដើមឡើងវិញ', 'Reset default catalog')}
        </button>
      </div>
    </div>
  );
};
