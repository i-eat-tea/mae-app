/**
 * ម៉ែ — by FlowErs
 * Curated Trusted Resource Card
 *
 * Displays curated reference articles with clear attribution,
 * simplified maternal summary, pregnancy stage, and link to original source.
 */

import React from 'react';
import { ExternalLink, BookOpen, Check, Volume2 } from 'lucide-react';
import { PregnancyResource } from '../types';
import { useApp } from '../context/AppContext';

interface ResourceCardProps {
  resource: PregnancyResource;
  onOpenDetail?: (res: PregnancyResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onOpenDetail }) => {
  const {
    setSelectedResource,
    canOpenSummary,
    setIsUpgradeModalOpen,
    logEvent,
    currentWeek,
    isResourceRead,
    toggleResourceRead,
    t,
  } = useApp();

  const isRead = isResourceRead(resource.id);

  const handleCardClick = () => {
    const check = canOpenSummary(resource);
    if (!check.allowed) {
      setIsUpgradeModalOpen(true, 'daily_limit');
      return;
    }

    if (onOpenDetail) {
      onOpenDetail(resource);
    } else {
      setSelectedResource(resource);
    }
    logEvent('resource_opened', resource.id, currentWeek, {
      title: resource.titleKh || resource.title,
    });
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logEvent('original_source_clicked', resource.id, currentWeek, {
      url: resource.sourceUrl,
      source: resource.sourceName,
    });
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleResourceRead(resource.id);
  };

  const title = t(resource.titleKh || resource.title || '', resource.titleEn || resource.title || '');
  const summary = t(resource.summaryKh || resource.summary || '', resource.summaryEn || resource.summary || '');

  return (
    <article
      onClick={handleCardClick}
      className={`group cursor-pointer rounded-3xl bg-white border p-5 shadow-xs hover:border-[#88A04D]/50 hover:shadow-md transition-all flex flex-col justify-between relative ${
        isRead ? 'border-[#88A04D]/40 bg-[#FAF9F5]/60' : 'border-[#E5EADF]'
      }`}
    >
      <div>
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5F6E60]">
            <span className="font-semibold text-[#5C7034]">{resource.category}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.pregnancyStage}</span>
            {resource.audioUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF1E4] text-[#5C7034] font-semibold text-[11px]">
                  <Volume2 className="w-3 h-3 text-[#88A04D]" />
                  <span>{t('សំឡេងណែនាំ', 'Audio')}</span>
                </span>
              </>
            )}
          </div>

          {/* Quick Mark Read button */}
          <button
            type="button"
            onClick={handleToggleRead}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              isRead
                ? 'bg-[#EBF1E4] text-[#5C7034] border border-[#88A04D]/30 font-semibold'
                : 'bg-[#FAF9F5] text-[#5F6E60] hover:text-[#233125] border border-[#E5EADF] hover:bg-[#EBF1E4]/50'
            }`}
            title={isRead ? t('សម្គាល់ថាមិនទាន់អាន', 'Mark unread') : t('សម្គាល់ថាបានអានរួច', 'Mark as read')}
          >
            {isRead ? (
              <>
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>{t('បានអាន', 'Read')}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#88A04D]" />
                <span>{t('មិនទាន់អាន', 'Unread')}</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#233125] font-serif leading-snug group-hover:text-[#5C7034] transition-colors mb-2">
          {title}
        </h3>

        {/* Trusted Source Attribution */}
        <div className="flex items-center gap-1.5 text-xs text-[#5F6E60] mb-3">
          <span className="font-medium text-[#233125]">{t('ប្រភព៖', 'Source:')}</span>
          <span className="truncate">{resource.sourceName}</span>
        </div>

        {/* Friendly Summary */}
        <p className="text-xs sm:text-sm text-[#233125]/85 leading-relaxed mb-4 line-clamp-3">
          “{summary}”
        </p>

        {/* What this helps with if present */}
        {resource.summaryPurpose && (
          <div className="rounded-xl bg-[#FAF9F5] border border-[#E5EADF] p-2.5 text-xs text-[#5C7034] mb-3">
            <span className="font-semibold block mb-0.5">{t('🌱 ជំនួយដល់ការយល់ដឹង៖', '🌱 Helps understand:')}</span>
            <span className="italic text-[#233125]/85">{resource.summaryPurpose}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#E5EADF]/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleCardClick}
          className="font-semibold text-[#88A04D] hover:text-[#5C7034] flex items-center gap-1"
        >
          {resource.audioUrl ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('ស្តាប់ / អានការណែនាំ', 'Listen / Guide')}</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('អានការណែនាំ', 'View Guide')}</span>
            </>
          )}
        </button>

        <a
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSourceClick}
          className="text-[#5F6E60] hover:text-[#233125] flex items-center gap-1 font-medium transition-colors"
          title={t('បើកឯកសារដើម', 'Open original scientific source')}
        >
          <span>{t('ឯកសារដើម', 'Original Source')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
