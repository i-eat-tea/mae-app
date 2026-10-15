/**
 * Botanical Flower Visual Component
 * Represents the mother's pregnancy progress through a tender growing flower.
 * Growth stages: Seed -> Sprout -> Budding -> Unfolding -> Bloom -> Full Blossom.
 */

import React from 'react';
import { FlowerStage } from '../types';

interface FlowerVisualProps {
  stage: FlowerStage;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FlowerVisual: React.FC<FlowerVisualProps> = ({
  stage,
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const { bloomIcon } = stage;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-[#EBF1E4]/70 border border-[#88A04D]/20 p-2 shadow-inner text-[#88A04D] ${sizeMap[size]} ${className}`}
      aria-label={`Pregnancy growth stage: ${stage.phaseNameKh || stage.phaseName || ''}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-700 ease-out"
      >
        {/* Soft Soil / Foundation curve */}
        <path
          d="M 15 88 Q 50 82 85 88"
          stroke="#88A04D"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Stage 1: Seed */}
        {bloomIcon === 'seed' && (
          <g>
            <ellipse
              cx="50"
              cy="74"
              rx="9"
              ry="13"
              transform="rotate(-15 50 74)"
              fill="#88A04D"
              opacity="0.8"
            />
            {/* Tiny sprout emerging */}
            <path
              d="M 50 63 Q 48 52 42 46"
              stroke="#88A04D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 42 46 Q 36 44 38 38 Q 44 40 42 46 Z"
              fill="#88A04D"
              opacity="0.9"
            />
          </g>
        )}

        {/* Stage 2: Sprout */}
        {bloomIcon === 'sprout' && (
          <g>
            {/* Stem */}
            <path
              d="M 50 86 Q 48 65 52 45"
              stroke="#88A04D"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path
              d="M 50 66 Q 32 60 26 50 Q 38 48 50 60 Z"
              fill="#88A04D"
              opacity="0.85"
            />
            {/* Right Leaf */}
            <path
              d="M 51 55 Q 70 50 76 38 Q 65 38 52 50 Z"
              fill="#88A04D"
              opacity="0.75"
            />
            {/* Tender Tip */}
            <circle cx="52" cy="43" r="3.5" fill="#DDE8F1" stroke="#88A04D" strokeWidth="1.5" />
          </g>
        )}

        {/* Stage 3: Budding */}
        {bloomIcon === 'bud' && (
          <g>
            {/* Stem */}
            <path
              d="M 50 86 Q 48 60 50 36"
              stroke="#88A04D"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Side Leaves */}
            <path
              d="M 49 68 Q 28 62 25 50 Q 38 50 49 63 Z"
              fill="#88A04D"
              opacity="0.8"
            />
            <path
              d="M 51 58 Q 72 52 75 42 Q 62 42 51 54 Z"
              fill="#88A04D"
              opacity="0.7"
            />
            {/* Bud Calyx */}
            <path
              d="M 42 38 Q 50 26 58 38 Q 50 44 42 38 Z"
              fill="#88A04D"
            />
            {/* Tightly folded petal inside */}
            <path
              d="M 46 36 Q 50 22 54 36"
              fill="#DDE8F1"
              stroke="#88A04D"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Stage 4: Unfolding */}
        {bloomIcon === 'unfolding' && (
          <g>
            {/* Stem */}
            <path
              d="M 50 86 Q 49 55 50 34"
              stroke="#88A04D"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path
              d="M 49 70 Q 24 64 20 48 Q 36 48 49 64 Z"
              fill="#88A04D"
              opacity="0.8"
            />
            <path
              d="M 51 60 Q 76 54 80 40 Q 64 40 51 56 Z"
              fill="#88A04D"
              opacity="0.75"
            />
            {/* Unfolding Petals */}
            <path
              d="M 50 34 C 40 22 36 12 48 10 C 50 18 50 26 50 34 Z"
              fill="#DDE8F1"
              stroke="#88A04D"
              strokeWidth="1.5"
            />
            <path
              d="M 50 34 C 60 22 64 12 52 10 C 50 18 50 26 50 34 Z"
              fill="#F7F5EE"
              stroke="#88A04D"
              strokeWidth="1.5"
            />
            <path
              d="M 50 34 C 34 26 30 18 42 16 C 46 22 48 28 50 34 Z"
              fill="#EBF1E4"
              stroke="#88A04D"
              strokeWidth="1.2"
              opacity="0.9"
            />
            <circle cx="50" cy="24" r="3.5" fill="#88A04D" />
          </g>
        )}

        {/* Stage 5: Radiant Bloom & Full Blossom */}
        {(bloomIcon === 'bloom' || bloomIcon === 'full_blossom') && (
          <g>
            {/* Stem */}
            <path
              d="M 50 86 Q 50 58 50 40"
              stroke="#88A04D"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path
              d="M 50 68 Q 24 64 18 50 Q 34 48 49 62 Z"
              fill="#88A04D"
              opacity="0.85"
            />
            <path
              d="M 50 58 Q 76 54 82 42 Q 66 42 51 54 Z"
              fill="#88A04D"
              opacity="0.8"
            />
            {/* 5 Petals Around Center */}
            {/* Top petal */}
            <path
              d="M 50 38 C 42 22 44 10 50 10 C 56 10 58 22 50 38 Z"
              fill="#DDE8F1"
              stroke="#88A04D"
              strokeWidth="1.4"
            />
            {/* Top Left */}
            <path
              d="M 50 38 C 30 30 22 20 28 14 C 36 10 44 26 50 38 Z"
              fill="#F7F5EE"
              stroke="#88A04D"
              strokeWidth="1.4"
            />
            {/* Top Right */}
            <path
              d="M 50 38 C 70 30 78 20 72 14 C 64 10 56 26 50 38 Z"
              fill="#F7F5EE"
              stroke="#88A04D"
              strokeWidth="1.4"
            />
            {/* Bottom Left */}
            <path
              d="M 50 38 C 30 46 22 36 28 30 C 36 26 44 32 50 38 Z"
              fill="#EBF1E4"
              stroke="#88A04D"
              strokeWidth="1.4"
            />
            {/* Bottom Right */}
            <path
              d="M 50 38 C 70 46 78 36 72 30 C 64 26 56 32 50 38 Z"
              fill="#EBF1E4"
              stroke="#88A04D"
              strokeWidth="1.4"
            />
            {/* Flower Center Stamen */}
            <circle cx="50" cy="36" r="6" fill="#88A04D" />
            <circle cx="50" cy="36" r="3.5" fill="#FAF9F5" />
          </g>
        )}
      </svg>
    </div>
  );
};
