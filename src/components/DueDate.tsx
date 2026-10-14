/**
 * ម៉ែ — by FlowErs
 * Due Date Calculator Modal (for ProfileScreen & Settings)
 */

import React, { useState, useMemo } from 'react';
import { X, Calendar, Check, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DueDateMethod } from '../types';
import {
  eddFromLmp,
  eddFromConception,
  lmpFromEdd,
  appWeek,
  formatDateToIsoDate,
  getCambodiaToday,
  addDays,
} from '../lib/dueDate';

interface DueDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { dueDate: string; method: DueDateMethod; calculatedWeek: number; lmpDate?: string }) => void;
  initialDueDate?: string;
  initialMethod?: DueDateMethod;
}

export const DueDateModal: React.FC<DueDateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDueDate,
  initialMethod = 'doctor',
}) => {
  const { t, logEvent } = useApp();

  const [method, setMethod] = useState<DueDateMethod>(initialMethod);
  const [doctorDueDate, setDoctorDueDate] = useState<string>(
    initialDueDate || formatDateToIsoDate(addDays(getCambodiaToday(), 180))
  );
  const [lmpDate, setLmpDate] = useState<string>(
    formatDateToIsoDate(addDays(getCambodiaToday(), -63))
  );
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [conceptionDate, setConceptionDate] = useState<string>(
    formatDateToIsoDate(addDays(getCambodiaToday(), -49))
  );

  const calculatedResult = useMemo(() => {
    try {
      let finalEdd: Date;
      let finalLmpStr: string | undefined = undefined;

      if (method === 'doctor') {
        finalEdd = new Date(doctorDueDate);
        finalLmpStr = formatDateToIsoDate(lmpFromEdd(doctorDueDate));
      } else if (method === 'lmp') {
        finalEdd = eddFromLmp(lmpDate, cycleLength);
        finalLmpStr = lmpDate;
      } else {
        finalEdd = eddFromConception(conceptionDate);
        finalLmpStr = formatDateToIsoDate(lmpFromEdd(finalEdd));
      }

      const eddIso = formatDateToIsoDate(finalEdd);
      const week = appWeek(eddIso);

      return { eddIso, finalLmpStr, week };
    } catch {
      return { eddIso: doctorDueDate, finalLmpStr: lmpDate, week: 9 };
    }
  }, [method, doctorDueDate, lmpDate, cycleLength, conceptionDate]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSave({
      dueDate: calculatedResult.eddIso,
      method,
      calculatedWeek: calculatedResult.week,
      lmpDate: calculatedResult.finalLmpStr,
    });
    logEvent('due_date_updated', undefined, calculatedResult.week, { method });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E5EADF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-sm shadow-2xs">
              📅
            </span>
            <h2 className="text-base font-serif font-bold text-[#233125]">
              {t('កែប្រែកាលបរិច្ឆេទសម្រាល', 'Change Due Date')}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Methods */}
          <div className="space-y-2">
            <label
              onClick={() => setMethod('doctor')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                method === 'doctor'
                  ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5EADF]'
              }`}
            >
              <input
                type="radio"
                name="modalMethod"
                checked={method === 'doctor'}
                onChange={() => setMethod('doctor')}
                className="text-[#88A04D]"
              />
              <span className="text-xs sm:text-sm font-bold text-[#233125]">
                {t('ថ្ងៃគ្រូពេទ្យប្រាប់', 'Doctor / Midwife date')}
              </span>
            </label>

            <label
              onClick={() => setMethod('lmp')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                method === 'lmp'
                  ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5EADF]'
              }`}
            >
              <input
                type="radio"
                name="modalMethod"
                checked={method === 'lmp'}
                onChange={() => setMethod('lmp')}
                className="text-[#88A04D]"
              />
              <span className="text-xs sm:text-sm font-bold text-[#233125]">
                {t('ថ្ងៃដំបូងនៃរដូវចុងក្រោយ (LMP)', 'Last menstrual period (LMP)')}
              </span>
            </label>

            <label
              onClick={() => setMethod('conception')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                method === 'conception'
                  ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5EADF]'
              }`}
            >
              <input
                type="radio"
                name="modalMethod"
                checked={method === 'conception'}
                onChange={() => setMethod('conception')}
                className="text-[#88A04D]"
              />
              <span className="text-xs sm:text-sm font-bold text-[#233125]">
                {t('ថ្ងៃបង្កកំណើត', 'Conception date')}
              </span>
            </label>
          </div>

          {/* Date Picker Input */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5EADF] space-y-3">
            {method === 'doctor' && (
              <div>
                <label className="block text-xs font-semibold text-[#233125] mb-1">
                  {t('កាលបរិច្ឆេទសម្រាល៖', 'Estimated due date:')}
                </label>
                <input
                  type="date"
                  value={doctorDueDate}
                  onChange={(e) => setDoctorDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs font-medium"
                />
              </div>
            )}

            {method === 'lmp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#233125] mb-1">
                    {t('ថ្ងៃដំបូងនៃរដូវចុងក្រោយ៖', 'First day of last period:')}
                  </label>
                  <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs font-medium"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{t('វដ្តរដូវ៖', 'Cycle length:')}</span>
                    <span className="font-bold text-[#5C7034]">{cycleLength} {t('ថ្ងៃ', 'days')}</span>
                  </div>
                  <input
                    type="range"
                    min={21}
                    max={45}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                    className="w-full accent-[#88A04D]"
                  />
                </div>
              </div>
            )}

            {method === 'conception' && (
              <div>
                <label className="block text-xs font-semibold text-[#233125] mb-1">
                  {t('ថ្ងៃបង្កកំណើត៖', 'Conception date:')}
                </label>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs font-medium"
                />
              </div>
            )}
          </div>

          {/* Result Card */}
          <div className="p-3.5 rounded-2xl bg-[#EBF1E4] border border-[#88A04D]/35 space-y-1 text-xs text-[#233125]">
            <p className="font-bold text-sm">
              {t(
                `ថ្ងៃសម្រាល៖ ${calculatedResult.eddIso} (សប្ដាហ៍ទី ${calculatedResult.week})`,
                `Due date: ${calculatedResult.eddIso} (Week ${calculatedResult.week})`
              )}
            </p>
            <p className="text-[11px] text-[#5F6E60]">
              {t('គណនាតាមរូបមន្តស្តង់ដារវេជ្ជសាស្ត្រ ACOG & StatPearls', 'Calculated using standard ACOG & StatPearls clinical formulas')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E5EADF] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-full border border-[#E5EADF] text-xs font-semibold text-[#233125] hover:bg-[#FAF9F5]"
          >
            {t('បោះបង់', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-[44px] px-6 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs font-bold shadow-2xs inline-flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('រក្សាទុក', 'Save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
