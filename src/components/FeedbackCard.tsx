/**
 * ម៉ែ — by FlowErs
 * Feature Feedback Card
 *
 * Lightweight, polite feedback question appearing contextually after a mother
 * uses a feature (e.g. finishes voice message, marks first article read, uses My Plan).
 *
 * Persists status in localStorage so each feature is only asked once.
 * Inserts directly into `feature_feedback` table in Supabase.
 */

import React, { useState, useEffect } from 'react';
import { Star, Send, X, Check, MessageSquareHeart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

interface FeedbackCardProps {
  feature: 'voice_message' | 'reading' | 'my_plan' | string;
  questionKh?: string;
  questionEn?: string;
  onClose?: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feature,
  questionKh,
  questionEn,
  onClose,
}) => {
  const { user, currentWeek, logEvent, t } = useApp();

  const storageKey = `mae_feedback_${feature}`;
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const alreadyHandled = localStorage.getItem(storageKey);
      if (!alreadyHandled) {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, [storageKey]);

  if (isDismissed) return null;

  // Default friendly questions
  const defaultQuestions: Record<string, { kh: string; en: string }> = {
    voice_message: {
      kh: 'តើសារសំឡេងរបស់ម៉ែមានប្រយោជន៍ និងធ្វើឱ្យអ្នកមានអារម្មណ៍កក់ក្តៅដែរឬទេ?',
      en: "Was Mom's voice message helpful and comforting to you?",
    },
    reading: {
      kh: 'តើអត្ថបទចំណេះដឹងនេះងាយស្រួលយល់ និងមានប្រយោជន៍ចំពោះអ្នកដែរឬទេ?',
      en: 'Was this article easy to understand and helpful?',
    },
    my_plan: {
      kh: 'តើមុខងារ «គម្រោងរបស់ខ្ញុំ» ជួយអ្នកក្នុងការត្រៀមខ្លួនបានល្អដែរឬទេ?',
      en: 'How helpful is "My Plan" in keeping you prepared?',
    },
  };

  const currentQKh = questionKh || defaultQuestions[feature]?.kh || 'តើអ្នកពេញចិត្តនឹងមុខងារនេះកម្រិតណា?';
  const currentQEn = questionEn || defaultQuestions[feature]?.en || 'How satisfied are you with this feature?';

  const handleSkip = () => {
    try {
      localStorage.setItem(storageKey, 'skipped');
    } catch {}
    setIsDismissed(true);
    if (onClose) onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Insert into Supabase feature_feedback table
      await supabase.from('feature_feedback').insert({
        user_id: user?.id || null,
        feature,
        rating,
        comment: comment.trim() || null,
      });

      // 2. Log research event
      logEvent('feedback_submitted' as any, feature, currentWeek, {
        rating,
        has_comment: !!comment.trim(),
      });

      // 3. Mark answered in localStorage
      try {
        localStorage.setItem(storageKey, 'submitted');
      } catch {}

      setIsSubmitted(true);

      // Auto-hide after 2 seconds
      setTimeout(() => {
        setIsDismissed(true);
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.warn('Feedback submit error', err);
      setIsDismissed(true);
      if (onClose) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full my-4 rounded-3xl bg-white border border-[#88A04D]/35 p-4 sm:p-5 shadow-sm transition-all animate-fade-in text-[#233125]">
      {isSubmitted ? (
        <div className="py-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-lg mx-auto">
            🌸
          </div>
          <p className="text-sm font-semibold text-[#5C7034]">
            {t('សូមអរគុណសម្រាប់មតិកែលម្អរបស់អ្នក 🌸', 'Thank you for your gentle feedback 🌸')}
          </p>
          <p className="text-xs text-[#5F6E60]">
            {t('មតិរបស់អ្នកជួយឱ្យ «ម៉ែ» កាន់តែប្រសើរឡើងសម្រាប់ម្តាយគ្រប់រូប។', 'Your thoughts help us improve for every mother.')}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center shrink-0">
                <MessageSquareHeart className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#233125] leading-snug">
                  {t(currentQKh, currentQEn)}
                </h4>
                <p className="text-[11px] text-[#5F6E60]">
                  {t('មតិស្មោះត្រង់របស់អ្នកមានតម្លៃណាស់សម្រាប់យើង 🌸', 'Your honest feedback means the world to us 🌸')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
              title={t('រំលង', 'Skip')}
              aria-label="Skip feedback"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Tappable Star Rating */}
          <div className="flex items-center justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1 rounded-xl hover:bg-[#FAF9F5] active:scale-110 transition-transform"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                        : 'text-gray-300 stroke-[1.5]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Optional comment text field */}
          <div className="space-y-1">
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('មតិយោបល់បន្ថែម (មិនចាំបាច់)...', 'Additional thoughts or comments (optional)...')}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:bg-white focus:border-[#88A04D] focus:outline-none transition-all placeholder:text-[#5F6E60]/70"
            />
            <p className="text-[10px] text-[#5F6E60] italic">
              {t(
                '* សូមកុំសរសេរព័ត៌មានផ្ទាល់ខ្លួន (ដូចជា ឈ្មោះពិត អាសយដ្ឋាន ឬលេខទូរស័ព្ទ)',
                '* Please do not write personal information (such as real name, address, or phone number)'
              )}
            </p>
          </div>

          {/* Buttons: Send & Skip */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className="min-h-[44px] px-4 py-2 rounded-full text-xs font-medium text-[#5F6E60] hover:text-[#233125] hover:bg-[#FAF9F5] transition-colors"
            >
              {t('រំលង (Skip)', 'Skip')}
            </button>

            <button
              type="button"
              disabled={rating === 0 || isSubmitting}
              onClick={() => handleSubmit()}
              className="min-h-[44px] px-5 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? t('កំពុងផ្ញើ...', 'Sending...') : t('ផ្ញើមតិ', 'Send')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
