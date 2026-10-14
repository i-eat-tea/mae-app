/**
 * ម៉ែ — by FlowErs
 * "ការរំលឹកពីម៉ែ" (A Little Reminder from Mom)
 *
 * Warm, reassuring, motherly advice.
 * Modular and easily customizable for written copy or voice notes.
 */

import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LittleReminderProps {
  note?: string;
  className?: string;
}

export const LittleReminder: React.FC<LittleReminderProps> = ({ note, className = '' }) => {
  const { t } = useApp();

  const defaultNote = t(
    'ការពពោះរបស់ម្តាយម្នាក់ៗមានសភាពប្លែកៗពីគ្នា។ ប្រសិនបើអ្នកមានអារម្មណ៍មិនស្រួល ឬមានការព្រួយបារម្ភ ចូរពិភាក្សាជាមួយឆ្មប ឬគ្រូពេទ្យនៅមណ្ឌលសុខភាពដោយភាពស្ងប់ចិត្តណា។',
    'Every pregnancy journey is unique. If anything worries you, gently discuss it with your midwife or healthcare provider.'
  );

  return (
    <div
      className={`rounded-3xl bg-[#DDE8F1]/45 border border-[#DDE8F1] p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs ${className}`}
      role="note"
      aria-label={t('ការរំលឹកពីម៉ែ', 'A Little Reminder from Mea')}
    >
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#88A04D] shadow-2xs border border-[#88A04D]/30 mt-0.5">
        <Heart className="w-4 h-4 fill-[#88A04D]/30 text-[#88A04D]" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C7034]">
          🌸 {t('ការរំលឹកពីម៉ែ', 'A Little Reminder from Mea')}
        </h3>
        <p className="text-xs sm:text-sm text-[#233125]/90 leading-relaxed font-normal">
          {note || defaultNote}
        </p>
      </div>
    </div>
  );
};
