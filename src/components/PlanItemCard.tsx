/**
 * ម៉ែ — by FlowErs
 * Plan Item Card
 *
 * Card for an individual plan item with checkbox toggle, delete button,
 * and gentle reminder tags.
 */

import React from 'react';
import { Check, Trash2, Calendar, Radio, BookOpen } from 'lucide-react';
import { PlanItem } from '../types';
import { useApp } from '../context/AppContext';
import { usePlan } from '../context/PlanContext';

interface PlanItemCardProps {
  item: PlanItem;
}

export const PlanItemCard: React.FC<PlanItemCardProps> = ({ item }) => {
  const { t } = useApp();
  const { toggleDone, deleteItem } = usePlan();

  const isVoice = item.source_type === 'voice_message';

  return (
    <div
      className={`group flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all ${
        item.done
          ? 'bg-[#FAF9F5]/70 border-[#E5EADF] opacity-75'
          : 'bg-white border-[#E5EADF] hover:border-[#88A04D]/40 shadow-2xs'
      }`}
    >
      {/* Tappable Checkbox */}
      <button
        type="button"
        onClick={() => toggleDone(item.id)}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl transition-all shrink-0 ${
          item.done
            ? 'text-[#5C7034]'
            : 'text-gray-400 hover:text-[#88A04D]'
        }`}
        aria-label={item.done ? t('មិនទាន់រួចរាល់', 'Mark undone') : t('រួចរាល់', 'Mark done')}
      >
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            item.done
              ? 'bg-[#88A04D] border-[#88A04D] text-white shadow-2xs'
              : 'border-[#CAD6BE] bg-white hover:border-[#88A04D]'
          }`}
        >
          {item.done && <Check className="w-4 h-4 stroke-[3]" />}
        </div>
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pt-1">
        <p
          className={`text-sm sm:text-base leading-relaxed text-[#233125] ${
            item.done ? 'line-through text-[#5F6E60]' : 'font-medium'
          }`}
        >
          {t(item.text_kh, item.text_en)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-[#5F6E60]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#E5EADF]">
            {isVoice ? <Radio className="w-3 h-3 text-[#88A04D]" /> : <BookOpen className="w-3 h-3 text-[#88A04D]" />}
            <span>{isVoice ? t('ពីសារសំឡេង', 'From Voice') : t('ពីអត្ថបទ', 'From Article')}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#E5EADF]">
            <Calendar className="w-3 h-3 text-[#5F6E60]" />
            <span>
              {item.start_date === item.end_date
                ? item.start_date
                : `${item.start_date} → ${item.end_date}`}
            </span>
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => deleteItem(item.id)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-red-500 rounded-full hover:bg-[#FAF9F5] transition-colors shrink-0"
        title={t('លុបចេញ', 'Delete')}
        aria-label="Delete item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
