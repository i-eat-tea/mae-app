/**
 * ម៉ែ — by FlowErs
 * Resource Detail Modal (R4 Update)
 *
 * Implements Step R4:
 * - Auto-marks as read when she reaches the bottom AND spends required time.
 * - Required time: >= 8 seconds or 40% of estimated reading time, whichever is larger.
 * - Short summaries that fit on screen without scrolling: time only (10 seconds).
 * - Avoids marking on quick flick: must meet both scroll end marker and reading time.
 * - Shows an "Undo" action on the confirmation toast.
 * - Logs `resource_read_completed` ({ seconds_spent, reached_end: true }).
 * - Logs `resource_opened` on open.
 * - Counts active reading seconds only when document.visibilityState === 'visible'.
 * - Shows a smooth reading progress bar at the top of the modal.
 * - Full cleanup on unmount / modal close.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ExternalLink, Edit3, Check, CalendarCheck, Clock } from 'lucide-react';
import { PregnancyResource } from '../types';
import { useApp } from '../context/AppContext';
import { FeedbackCard } from './FeedbackCard';
import { AddToPlanSheet } from './AddToPlanSheet';
import { AudioPlayer } from './AudioPlayer';

interface ResourceModalProps {
  resource: PregnancyResource;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  const {
    setEditingResource,
    setIsContentEntryOpen,
    logEvent,
    currentWeek,
    isResourceRead,
    toggleResourceRead,
    markResourceAsRead,
    isPremium,
    setIsUpgradeModalOpen,
    canOpenSummary,
    trackOpenedSummary,
    t,
  } = useApp();

  const isRead = isResourceRead(resource.id);
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);

  // R4 State & Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const endMarkerRef = useRef<HTMLDivElement>(null);

  const [secondsSpent, setSecondsSpent] = useState<number>(0);
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  const hasAutoMarkedRef = useRef<boolean>(false);
  const secondsSpentRef = useRef<number>(0);
  const hasReachedEndRef = useRef<boolean>(false);

  // Estimate reading time: ~3 words per second (Khmer / English)
  const requiredSeconds = useMemo(() => {
    const fullText = [
      resource.titleKh,
      resource.titleEn,
      resource.summaryKh,
      resource.summaryEn,
      resource.summaryPurpose,
      resource.weeklyFocus,
    ]
      .filter(Boolean)
      .join(' ');

    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    const estimatedSeconds = Math.max(15, Math.round(words / 3));
    // 40% of estimated reading time or minimum 8s
    const computedThreshold = Math.max(8, Math.round(estimatedSeconds * 0.4));
    return computedThreshold;
  }, [resource]);

  // Threshold used: 10s if fits on screen without scroll, else requiredSeconds
  const effectiveTimeThreshold = isScrollable ? requiredSeconds : 10;

  // 1. Entitlement check & log resource_opened on open
  useEffect(() => {
    const check = canOpenSummary(resource);
    if (!check.allowed) {
      onClose();
      setIsUpgradeModalOpen(true, 'daily_limit');
      return;
    }

    trackOpenedSummary(resource);

    logEvent('resource_opened', resource.id, currentWeek, {
      title: resource.titleKh || resource.title,
      source: resource.sourceName,
      category: resource.category,
    });
  }, [resource.id]);

  // 2. Timer: count time only while page is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        secondsSpentRef.current += 1;
        setSecondsSpent(secondsSpentRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Setup IntersectionObserver & scroll metrics
  useEffect(() => {
    const container = scrollContainerRef.current;
    const marker = endMarkerRef.current;
    if (!container || !marker) return;

    // Check if content fits without scrolling
    const checkScrollable = () => {
      const scrollable = container.scrollHeight > container.clientHeight + 20;
      setIsScrollable(scrollable);
      return scrollable;
    };

    checkScrollable();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasReachedEndRef.current = true;
            setHasReachedEnd(true);
          }
        });
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(marker);

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
        setScrollPercentage(pct);
      } else {
        setScrollPercentage(100);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [resource.id]);

  // 4. Auto-mark as read evaluation
  useEffect(() => {
    // Already marked or already auto-marked in this session
    if (isRead || hasAutoMarkedRef.current) return;

    const conditionMet = isScrollable
      ? (hasReachedEnd && secondsSpent >= requiredSeconds)
      : (secondsSpent >= 10);

    if (conditionMet) {
      hasAutoMarkedRef.current = true;
      markResourceAsRead(resource.id, { showUndoToast: true });

      logEvent('resource_read_completed', resource.id, currentWeek, {
        seconds_spent: secondsSpent,
        reached_end: hasReachedEnd || !isScrollable,
        is_scrollable: isScrollable,
        time_threshold: effectiveTimeThreshold,
      });
    }
  }, [
    secondsSpent,
    hasReachedEnd,
    isScrollable,
    isRead,
    requiredSeconds,
    effectiveTimeThreshold,
    resource.id,
    currentWeek,
  ]);

  // 5. Reading progress percentage for progress bar
  const visualProgress = useMemo(() => {
    if (isRead) return 100;
    const timeProgress = Math.min(100, Math.round((secondsSpent / effectiveTimeThreshold) * 100));
    if (!isScrollable) return timeProgress;
    // Weighted: 50% scroll reach, 50% reading time
    const scrollPart = hasReachedEnd ? 50 : Math.round(scrollPercentage * 0.5);
    const timePart = Math.round(timeProgress * 0.5);
    return Math.min(99, scrollPart + timePart);
  }, [isRead, secondsSpent, effectiveTimeThreshold, isScrollable, hasReachedEnd, scrollPercentage]);

  const planSuggestions =
    resource.planSuggestions && resource.planSuggestions.length > 0
      ? resource.planSuggestions
      : [
          {
            id: `sug_${resource.id}_1`,
            text_kh: `អ្នកអាចពិចារណាអនុវត្តតាមការណែនាំពីអត្ថបទ៖ ${resource.titleKh}`,
            text_en: `You may want to consider applying the guidance from: ${
              resource.titleEn || resource.titleKh
            }`,
          },
        ];

  const handleOpenSource = () => {
    markResourceAsRead(resource.id, { showUndoToast: true });
    logEvent('original_source_clicked', resource.id, currentWeek, {
      source: resource.sourceName,
      url: resource.sourceUrl,
      from: 'resource_modal',
    });
  };

  const handleToggleRead = () => {
    toggleResourceRead(resource.id);
  };

  const handleEdit = () => {
    setEditingResource(resource);
    setIsContentEntryOpen(true);
    onClose();
  };

  const title = t(
    resource.titleKh || resource.title || '',
    resource.titleEn || resource.title || ''
  );
  const summary = t(
    resource.summaryKh || resource.summary || '',
    resource.summaryEn || resource.summary || ''
  );

  // If blocked by daily limit, render null while modal closes
  const accessCheck = canOpenSummary(resource);
  if (!accessCheck.allowed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
        {/* Step R4: Reading Progress Bar at the Very Top */}
        <div className="w-full bg-[#E5EADF] h-1.5 shrink-0 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isRead ? 'bg-[#88A04D]' : 'bg-[#88A04D]'
            }`}
            style={{ width: `${visualProgress}%` }}
          />
        </div>

        {/* Header Bar - Sticky */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E5EADF] flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#5C7034] font-medium mb-1">
              <span>{resource.category}</span>
              <span aria-hidden="true">·</span>
              <span>{resource.pregnancyStage}</span>
              {isRead ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#88A04D] font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>{t('បានអានរួច', 'Read')}</span>
                  </span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#5F6E60] flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#88A04D]" />
                    <span>{secondsSpent}s</span>
                  </span>
                </>
              )}
            </div>
            <h2
              id="resource-modal-title"
              className="text-base sm:text-xl font-bold text-[#233125] font-serif leading-snug"
            >
              {title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#5F6E60] mt-1">
              {t('ប្រភពដែលអាចទុកចិត្តបាន៖', 'Trusted Source:')}{' '}
              <span className="font-semibold text-[#233125]">{resource.sourceName}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleToggleRead}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border text-xs font-medium transition-colors ${
                isRead
                  ? 'bg-[#EBF1E4] text-[#5C7034] border-[#88A04D]/40'
                  : 'bg-[#FAF9F5] text-[#5F6E60] hover:text-[#233125] border-[#E5EADF]'
              }`}
              title={
                isRead
                  ? t('សម្គាល់ថាមិនទាន់អាន', 'Mark unread')
                  : t('សម្គាល់ថាបានអាន', 'Mark as read')
              }
              aria-label="Toggle read status"
            >
              <Check className={`w-4 h-4 ${isRead ? 'stroke-[2.5]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          ref={scrollContainerRef}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 relative"
        >
          {/* Audio Player if resource has audio source */}
          {resource.audioUrl && (
            <div className="mb-2">
              <AudioPlayer
                title={title}
                subtitle={resource.sourceName}
                audioUrl={resource.audioUrl}
                transcript={resource.audioTranscriptKh || resource.audioTranscriptEn || summary}
                durationStr={resource.audioDuration || '2:15'}
                sourceType="resource"
                sourceId={resource.id}
                planSuggestions={resource.planSuggestions}
              />
            </div>
          )}

          {/* FlowErs Friendly Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C7034]">
              🌸 {t('សេចក្តីសង្ខេប', 'Friendly Summary')}
            </h3>
            <div className="rounded-2xl bg-white border border-[#E5EADF] p-4 text-sm sm:text-base text-[#233125] leading-relaxed">
              {summary}
            </div>
          </div>

          {/* What This Summary Helps With */}
          {resource.summaryPurpose && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6E60]">
                🌱 {t('ជំនួយដល់ការយល់ដឹងរបស់អ្នក', 'What this helps you understand')}
              </h3>
              <p className="text-xs sm:text-sm text-[#233125]/85 bg-[#F0F4E8]/60 p-3.5 rounded-xl border border-[#88A04D]/20 leading-relaxed">
                {resource.summaryPurpose}
              </p>
            </div>
          )}

          {/* Weekly / Stage Focus */}
          {resource.weeklyFocus && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#88A04D]">
                📝 {t('ចំណុចផ្តោតសំខាន់', 'Stage Focus')}
              </h3>
              <div className="rounded-xl bg-[#DDE8F1]/40 border border-[#DDE8F1] p-3.5 text-xs sm:text-sm text-[#233125] leading-relaxed">
                {resource.weeklyFocus}
              </div>
            </div>
          )}

          {/* Feedback Card after reading */}
          {isRead && <FeedbackCard feature="reading" />}

          {/* Step R4: Invisible end marker for IntersectionObserver */}
          <div
            ref={endMarkerRef}
            className="w-full h-1 pointer-events-none opacity-0"
            aria-hidden="true"
          />
        </div>

        {/* Footer Actions - Safe area padded */}
        <div className="p-3 sm:p-5 bg-white border-t border-[#E5EADF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
            <button
              type="button"
              onClick={handleToggleRead}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border transition-all ${
                isRead
                  ? 'bg-[#EBF1E4] text-[#5C7034] border-[#88A04D]/40'
                  : 'bg-white text-[#5F6E60] hover:text-[#233125] border-[#E5EADF] hover:bg-[#FAF9F5]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {isRead ? t('បានអានរួច', 'Marked Read') : t('សម្គាល់ថាបានអាន', 'Mark as Read')}
              </span>
            </button>

            {/* Add to My Plan Button (Preview for free, full edit for premium) */}
            <button
              type="button"
              onClick={() => setIsPlanSheetOpen(true)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-[#88A04D]/40 bg-[#F0F4E8] text-[#5C7034] hover:bg-[#EBF1E4] transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-[#88A04D]" />
              <span>{t('បញ្ចូលក្នុងគម្រោង', 'Add to My Plan')}</span>
            </button>

            <button
              type="button"
              onClick={handleEdit}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#5F6E60] hover:text-[#233125] px-3 py-2 rounded-lg hover:bg-[#FAF9F5] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('កែប្រែ', 'Edit')}</span>
            </button>
          </div>

          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenSource}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            <span>{t('អានឯកសារដើម', 'Read Original Source')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Add To Plan Bottom Sheet */}
      <AddToPlanSheet
        isOpen={isPlanSheetOpen}
        onClose={() => setIsPlanSheetOpen(false)}
        sourceType="resource"
        sourceId={resource.id}
        sourceTitle={t(resource.titleKh, resource.titleEn)}
        suggestions={planSuggestions}
      />
    </div>
  );
};
