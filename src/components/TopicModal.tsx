/**
 * ម៉ែ — by FlowErs
 * Topic Detail Modal
 * Displays small focus details and connects them directly to verified
 * trusted resources (NMCHC, WHO, UNICEF, RHAC).
 *
 * R1 update:
 * - Tapping "Original source" opens the external URL in a new tab and logs original_source_clicked.
 * - Tapping the title or "Read summary" opens ResourceModal directly on top (higher z-index).
 */

import React from 'react';
import { X, ExternalLink, ArrowRight, BookOpen, HelpCircle, Heart } from 'lucide-react';
import { FocusTopic, PregnancyResource } from '../types';
import { useApp } from '../context/AppContext';

interface TopicModalProps {
  topic: FocusTopic;
  onClose: () => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({ topic, onClose }) => {
  const {
    getResourceById,
    setSelectedResource,
    canOpenSummary,
    setIsUpgradeModalOpen,
    logEvent,
    currentWeek,
    t,
  } = useApp();

  const linkedResources = topic.resourceIds
    .map((id) => getResourceById(id))
    .filter(Boolean) as PregnancyResource[];

  const handleResourceSummaryClick = (res: PregnancyResource) => {
    const check = canOpenSummary(res);
    if (!check.allowed) {
      setIsUpgradeModalOpen(true, 'daily_limit');
      return;
    }
    setSelectedResource(res);
    logEvent('resource_opened', res.id, currentWeek, {
      from: 'topic_modal',
      topic: topic.titleKh,
    });
  };

  const handleOpenOriginalSource = (res: PregnancyResource, e: React.MouseEvent) => {
    // Allows default navigation to target="_blank"
    e.stopPropagation();
    logEvent('original_source_clicked', res.id, currentWeek, {
      url: res.sourceUrl,
      source: res.sourceName,
      from: 'topic_modal',
      topic: topic.titleKh,
    });
  };

  const title = t(topic.titleKh, topic.titleEn);
  const summary = t(topic.summaryKh, topic.summaryEn);
  const suggestedQuestions =
    t(topic.suggestedQuestionsKh?.join('||') || '', topic.suggestedQuestionsEn?.join('||') || '')
      .split('||')
      .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E5EADF] flex items-start justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#88A04D] uppercase tracking-wider block mb-1">
              🌸 {t('ចំណុចផ្តោតសំខាន់', 'Key Focus')} · {topic.category}
            </span>
            <h2
              id="topic-modal-title"
              className="text-base sm:text-xl font-bold text-[#233125] font-serif leading-snug"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Summary Box */}
          <div className="rounded-2xl bg-white border border-[#E5EADF] p-4 text-sm sm:text-base text-[#233125] leading-relaxed">
            <p>{summary}</p>
          </div>

          {/* Suggested Questions to Ask Midwife / Doctor */}
          {suggestedQuestions.length > 0 && (
            <div className="rounded-2xl bg-[#EBF1E4]/60 border border-[#88A04D]/30 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7034]">
                <HelpCircle className="w-4 h-4 text-[#88A04D]" />
                <span>{t('សំណួរដែលសួរគ្រូពេទ្យ ឬឆ្មប', 'Questions to Ask Your Doctor or Midwife')}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#233125]">
                {suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#E5EADF]/60">
                    <span className="text-[#88A04D] font-bold shrink-0">?</span>
                    <span className="italic">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Connected Verified Resources */}
          {linkedResources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5F6E60] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[#88A04D]" />
                <span>{t('ឯកសារយោងដែលអាចទុកចិត្តបាន (ក្រសួងសុខាភិបាល / WHO / UNICEF)', 'Trusted References')}</span>
              </div>

              <div className="space-y-2.5">
                {linkedResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E5EADF] hover:border-[#88A04D]/60 hover:shadow-xs transition-all space-y-3"
                  >
                    {/* Title row: Tapping title opens the summary */}
                    <div
                      onClick={() => handleResourceSummaryClick(res)}
                      className="cursor-pointer group flex items-start justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#233125] group-hover:text-[#5C7034] transition-colors leading-snug">
                          {t(res.titleKh || res.title, res.titleEn || res.title)}
                        </h4>
                        <p className="text-[11px] text-[#5F6E60] mt-0.5">
                          {t('ប្រភព៖', 'Source:')}{' '}
                          <span className="font-medium text-[#233125]">{res.sourceName}</span>
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#88A04D] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Bottom action row: two visually distinct actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5EADF]/70">
                      {/* Action 1: Read summary button */}
                      <button
                        type="button"
                        onClick={() => handleResourceSummaryClick(res)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#EBF1E4] hover:bg-[#88A04D] hover:text-white text-[#5C7034] text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-98"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('អានសង្ខេប', 'Read summary')}</span>
                      </button>

                      {/* Action 2: Direct link to original source */}
                      {res.sourceUrl && (
                        <a
                          href={res.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleOpenOriginalSource(res, e)}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-white border border-[#CAD6BE] text-[#5F6E60] hover:text-[#233125] text-xs font-medium transition-all inline-flex items-center gap-1.5 active:scale-98"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#88A04D]" />
                          <span>{t('ឯកសារដើម', 'Original source')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Safe area bottom */}
        <div className="p-3 sm:p-5 bg-white border-t border-[#E5EADF] flex items-center justify-end shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-xs sm:text-sm font-semibold text-[#233125] hover:bg-[#EBF1E4] active:bg-[#EBF1E4] transition-colors"
          >
            {t('បិទ', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
