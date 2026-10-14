/**
 * ម៉ែ — by FlowErs
 * BabyGrowthCard Component (R2)
 *
 * One unified, consistent card for baby growth (flower stage + Cambodian fruit size):
 * - Left side: Botanical flower stage visual
 * - Right side: Cambodian fruit comparison with "about X cm"
 * - Under both: Week number and short stage name
 * - Fully responsive: side-by-side by default, stacks vertically on narrow phones (< 360px)
 * - Zero source text or links on this card (strictly size and name)
 * - If no fruit size entry exists for the week (e.g. weeks 1–3), hides the fruit half cleanly.
 * - Khmer first, English second.
 */

import React from 'react';
import { FlowerVisual } from './FlowerVisual';
import { BABY_SIZES_TABLE } from '../data/babySizes';
import { getMonthlyMessageForWeek } from '../data/monthlyMessages';
import { useApp } from '../context/AppContext';

interface BabyGrowthCardProps {
  week: number;
  className?: string;
  showDescription?: boolean;
}

export const BabyGrowthCard: React.FC<BabyGrowthCardProps> = ({
  week,
  className = '',
  showDescription = true,
}) => {
  const { t } = useApp();

  const safeWeek = Math.max(1, Math.min(40, Math.round(week)));
  const monthlyMsg = getMonthlyMessageForWeek(safeWeek);
  const flowerStage = monthlyMsg.flowerStage;

  // Find exact baby fruit comparison without artificial fallback
  const babySize = BABY_SIZES_TABLE.find((item) => item.week === safeWeek);

  const fruitName = babySize ? t(babySize.fruitKh, babySize.fruitEn) : '';
  const stageName = t(flowerStage.phaseNameKh, flowerStage.phaseNameEn);
  const stageDescription = t(flowerStage.descriptionKh, flowerStage.descriptionEn);

  return (
    <div
      className={`rounded-3xl bg-white border border-[#E5EADF] p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      {/* Top Section: Flower Visual (Left) & Fruit Size (Right) */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          babySize ? 'grid-cols-1 min-[360px]:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Left Side: Botanical Flower Stage */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF]/80 text-center min-h-[140px]">
          <div className="flex items-center justify-center">
            <FlowerVisual stage={flowerStage} size="md" className="sm:scale-110" />
          </div>
          <div className="mt-2 space-y-0.5">
            <span className="text-[11px] font-semibold text-[#88A04D] block uppercase tracking-wider">
              {flowerStage.percent}% {t('នៃការលូតលាស់', 'Growth')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#233125] block truncate max-w-[150px]">
              {stageName}
            </span>
          </div>
        </div>

        {/* Right Side: Cambodian Fruit Size Comparison (Hidden if no entry exists) */}
        {babySize && (
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5EADF]/80 text-center min-h-[140px]">
            {/* Fruit Emoji Badge */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#CAD6BE] shadow-2xs flex items-center justify-center text-2xl select-none">
              <span role="img" aria-label={fruitName}>
                {babySize.emoji || '🌱'}
              </span>
            </div>

            <div className="mt-2 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#233125] leading-tight truncate max-w-[150px]">
                {fruitName}
              </h4>
              <p className="text-xs font-semibold text-[#88A04D]">
                {t('ប្រហែល', 'about')} {babySize.sizeCm} {t('ស.ម', 'cm')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Under Both: Week Number and Short Stage Name */}
      <div className="mt-3.5 pt-3 border-t border-[#E5EADF]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EBF1E4] text-[#5C7034] font-bold text-[11px]">
            {t(`សប្ដាហ៍ទី ${safeWeek}`, `Week ${safeWeek}`)}
          </span>
          <span className="font-semibold text-[#233125] truncate">
            {stageName}
          </span>
        </div>

        {showDescription && stageDescription && (
          <p className="text-[11px] sm:text-xs text-[#5F6E60] italic leading-tight truncate sm:max-w-xs">
            “{stageDescription}”
          </p>
        )}
      </div>
    </div>
  );
};
