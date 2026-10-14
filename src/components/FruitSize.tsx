/**
 * ម៉ែ — by FlowErs
 * Baby Size as Fruit Component
 *
 * Displays a gentle, visual comparison of baby size to familiar Cambodian fruits,
 * including length in centimeters and an explicit disclaimer that sizes are approximate.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { getBabySizeForWeek } from '../data/babySizes';
import { Sparkles } from 'lucide-react';

interface FruitSizeProps {
  week?: number;
  compact?: boolean;
}

export const FruitSize: React.FC<FruitSizeProps> = ({ week, compact = false }) => {
  const { currentWeek, t } = useApp();
  const targetWeek = week !== undefined ? week : currentWeek;
  const babySize = getBabySizeForWeek(targetWeek);

  const fruitName = t(babySize.fruitKh, babySize.fruitEn);

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/90 border border-[#E5EADF] shadow-2xs">
        <span className="text-xl leading-none select-none" role="img" aria-label={fruitName}>
          {babySize.emoji || '🌱'}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold text-[#233125]">
            {fruitName}
          </span>
          <span className="text-[10px] text-[#5F6E60]">
            {t(`ប្រហែល ${babySize.sizeCm} ស.ម`, `~${babySize.sizeCm} cm`)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E5EADF] shadow-2xs">
      {/* Fruit Emoji Badge */}
      <div className="w-11 h-11 rounded-2xl bg-[#F0F4E8] border border-[#88A04D]/30 flex items-center justify-center text-2xl shrink-0 shadow-2xs select-none">
        {babySize.emoji || '🌱'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#5C7034]">
          <Sparkles className="w-3 h-3 text-[#88A04D]" />
          <span>{t('ទំហំប៉ុនផ្លែឈើ', 'Baby Size')}</span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-0.5 truncate">
          <h4 className="text-sm font-bold text-[#233125] truncate">
            {fruitName}
          </h4>
          <span className="text-xs font-semibold text-[#88A04D] shrink-0">
            {t(`ប្រហែល ${babySize.sizeCm} ស.ម`, `~${babySize.sizeCm} cm`)}
          </span>
        </div>

        <p className="text-[10px] text-[#5F6E60] italic mt-0.5">
          {t('ទំហំប៉ាន់ស្មានប៉ុណ្ណោះ', 'Sizes are approximate')}
        </p>
      </div>
    </div>
  );
};
