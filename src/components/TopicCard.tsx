/**
 * ម៉ែ — by FlowErs
 * Focus Topic Card
 *
 * Small, calm focus card derived directly from verified health authority resources.
 */

import React from 'react';
import { Utensils, Stethoscope, Leaf, HelpCircle, ArrowRight } from 'lucide-react';
import { FocusTopic } from '../types';
import { useApp } from '../context/AppContext';

interface TopicCardProps {
  topic: FocusTopic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const { setSelectedTopic, logEvent, currentWeek, t } = useApp();

  const getIcon = () => {
    switch (topic.iconType as string) {
      case 'nutrition':
        return <Utensils className="w-5 h-5 text-[#88A04D]" />;
      case 'checkup':
        return <Stethoscope className="w-5 h-5 text-[#88A04D]" />;
      case 'daily':
        return <Leaf className="w-5 h-5 text-[#88A04D]" />;
      case 'questions':
        return <HelpCircle className="w-5 h-5 text-[#88A04D]" />;
      default:
        return <Leaf className="w-5 h-5 text-[#88A04D]" />;
    }
  };

  const handleClick = () => {
    setSelectedTopic(topic);
    logEvent('topic_opened', topic.id, currentWeek, {
      title: topic.titleKh,
      category: topic.category,
    });
  };

  const title = t(topic.titleKh, topic.titleEn);
  const summary = t(topic.summaryKh, topic.summaryEn);

  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white border border-[#E5EADF] p-5 shadow-xs hover:border-[#88A04D]/40 hover:shadow-md transition-all group">
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F0F4E8] flex items-center justify-center border border-[#88A04D]/20 shadow-2xs">
            {getIcon()}
          </div>
          <span className="text-[11px] font-medium text-[#5F6E60]">
            {topic.category.split(' ')[0]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#233125] font-serif mb-2 group-hover:text-[#5C7034] transition-colors leading-snug">
          {title}
        </h3>

        {/* Summary (1-2 sentences) */}
        <p className="text-xs sm:text-sm text-[#5F6E60] leading-relaxed line-clamp-3">
          {summary}
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-[#E5EADF]/60 flex items-center justify-between">
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#88A04D] group-hover:text-[#5C7034] transition-colors"
        >
          <span>{t('ស្វែងយល់បន្ថែម', 'Learn more')}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>

        <span className="text-[11px] text-[#5F6E60]">
          {topic.resourceIds.length} {t('ឯកសារយោង', 'sources')}
        </span>
      </div>
    </div>
  );
};
