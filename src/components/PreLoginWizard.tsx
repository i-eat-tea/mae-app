/**
 * ម៉ែ — by FlowErs
 * Pre-Login Onboarding Wizard & Due Date Calculator (Step R3)
 *
 * Collects:
 * - Screen 1: Due date / gestational age (Doctor date, LMP with cycle length, or Conception date)
 * - Screen 2: First pregnancy? (Yes / No / Prefer not to say; if No, children count)
 * - Screen 3: Occupation / daily life (Optional with Skip)
 *
 * Privacy & Safety:
 * - All answers are kept in browser memory / localStorage only.
 * - ZERO rows or events are written to Supabase for unauthenticated visitors.
 * - When she signs up, answers are automatically attached to her new user profile row.
 * - Logs onboarding_question_answered with question ID only (never personal answers).
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
  Heart,
  Baby,
  Briefcase,
  ExternalLink,
  X,
} from 'lucide-react';
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

export const WIZARD_ANSWERS_STORAGE_KEY = 'mea_pre_login_answers_v1';

export interface PreLoginAnswers {
  dueDateMethod?: DueDateMethod;
  dueDate?: string; // YYYY-MM-DD
  lmpDate?: string; // YYYY-MM-DD
  cycleLength?: number;
  conceptionDate?: string;
  calculatedWeek?: number;
  isFirstPregnancy?: boolean;
  childrenCount?: number;
  preferNotToSayFirstPregnancy?: boolean;
  occupation?: string;
}

export function getSavedPreLoginAnswers(): PreLoginAnswers | null {
  try {
    const raw = localStorage.getItem(WIZARD_ANSWERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePreLoginAnswers(answers: PreLoginAnswers) {
  try {
    localStorage.setItem(WIZARD_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
  } catch {}
}

export function clearPreLoginAnswers() {
  try {
    localStorage.removeItem(WIZARD_ANSWERS_STORAGE_KEY);
  } catch {}
}

interface PreLoginWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: PreLoginAnswers) => void;
}

export const PreLoginWizard: React.FC<PreLoginWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { t, logEvent } = useApp();

  const [screen, setScreen] = useState<1 | 2 | 3>(1);
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

  // Screen 1: Due date calculation
  const [method, setMethod] = useState<DueDateMethod>('doctor');
  const [doctorDueDate, setDoctorDueDate] = useState<string>(() => {
    // Default ~28 weeks out
    return formatDateToIsoDate(addDays(getCambodiaToday(), 180));
  });
  const [lmpDate, setLmpDate] = useState<string>(() => {
    // Default ~9 weeks ago
    return formatDateToIsoDate(addDays(getCambodiaToday(), -63));
  });
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [conceptionDate, setConceptionDate] = useState<string>(() => {
    // Default ~7 weeks ago
    return formatDateToIsoDate(addDays(getCambodiaToday(), -49));
  });

  // Screen 2: First pregnancy
  const [firstPregnancyChoice, setFirstPregnancyChoice] = useState<'yes' | 'no' | 'prefer_not'>('yes');
  const [childrenCount, setChildrenCount] = useState<number>(1);

  // Screen 3: Occupation
  const [occupation, setOccupation] = useState<string>('');

  // Calculate final EDD & app week dynamically based on selected method
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

      return {
        eddIso,
        finalLmpStr,
        week,
      };
    } catch {
      return {
        eddIso: doctorDueDate,
        finalLmpStr: lmpDate,
        week: 9,
      };
    }
  }, [method, doctorDueDate, lmpDate, cycleLength, conceptionDate]);

  if (!isOpen) return null;

  const handleNextFromScreen1 = () => {
    logEvent('onboarding_question_answered', undefined, undefined, { question_id: 'due_date' });
    setScreen(2);
  };

  const handleNextFromScreen2 = () => {
    logEvent('onboarding_question_answered', undefined, undefined, { question_id: 'first_pregnancy' });
    setScreen(3);
  };

  const handleFinish = (skippedOccupation = false) => {
    logEvent('onboarding_question_answered', undefined, undefined, {
      question_id: 'daily_life_occupation',
      skipped: skippedOccupation,
    });

    const finalAnswers: PreLoginAnswers = {
      dueDateMethod: method,
      dueDate: calculatedResult.eddIso,
      lmpDate: calculatedResult.finalLmpStr,
      cycleLength: method === 'lmp' ? cycleLength : undefined,
      conceptionDate: method === 'conception' ? conceptionDate : undefined,
      calculatedWeek: calculatedResult.week,
      isFirstPregnancy: firstPregnancyChoice === 'prefer_not' ? undefined : firstPregnancyChoice === 'yes',
      preferNotToSayFirstPregnancy: firstPregnancyChoice === 'prefer_not',
      childrenCount: firstPregnancyChoice === 'no' ? childrenCount : 0,
      occupation: skippedOccupation ? undefined : (occupation || undefined),
    };

    savePreLoginAnswers(finalAnswers);
    onComplete(finalAnswers);
  };

  const OCCUPATIONS = [
    { id: 'homemaker', kh: 'មេផ្ទះ / ថែទាំគ្រួសារពេញម៉ោង', en: 'Full-time homemaker' },
    { id: 'office', kh: 'បុគ្គលិកការិយាល័យ ឬមន្ត្រីរាជការ', en: 'Office or government worker' },
    { id: 'garment', kh: 'កម្មការិនីរោងចក្រ ឬកាត់ដេរ', en: 'Factory or garment worker' },
    { id: 'seller', kh: 'អាជីវករ / អ្នកលក់ដូរតាមផ្សារ', en: 'Business or market seller' },
    { id: 'farmer', kh: 'កសិករ / ធ្វើស្រែចម្ការ', en: 'Farmer' },
    { id: 'student', kh: 'សិស្ស / និស្សិត', en: 'Student' },
    { id: 'other', kh: 'ផ្សេងៗ', en: 'Other' },
    { id: 'prefer_not', kh: 'មិនបញ្ជាក់', en: 'Prefer not to say' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slide-up">
        {/* Header with Step Indicator */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E5EADF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-sm shadow-2xs">
              🌸
            </span>
            <div>
              <span className="text-[11px] font-semibold text-[#88A04D] uppercase tracking-wider block">
                {t('ជំហានទី', 'Step')} {screen} / 3
              </span>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#233125]">
                {screen === 1 && t('កាលបរិច្ឆេទសម្រាលរបស់អ្នក', 'Your Estimated Due Date')}
                {screen === 2 && t('បទពិសោធន៍មានផ្ទៃពោះ', 'Pregnancy Experience')}
                {screen === 3 && t('ជីវិតប្រចាំថ្ងៃរបស់អ្នក', 'Your Daily Life')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#E5EADF] h-1.5 shrink-0">
          <div
            className="bg-[#88A04D] h-1.5 transition-all duration-300"
            style={{ width: `${(screen / 3) * 100}%` }}
          />
        </div>

        {/* Body Container */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* ================================================================= */}
          {/* SCREEN 1: Due Date Calculator */}
          {/* ================================================================= */}
          {screen === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#233125] font-serif leading-snug">
                  {t('តើអ្នកចង់កំណត់ថ្ងៃសម្រាលដោយរបៀបណា?', 'How would you like to set your due date?')}
                </h3>
                <p className="text-xs text-[#5F6E60] mt-1">
                  {t(
                    'ជ្រើសរើសជម្រើសមួយដែលសមស្របនឹងអ្នកបំផុត។',
                    'Choose the option that best fits your situation.'
                  )}
                </p>
              </div>

              {/* Three Method Choices */}
              <div className="space-y-2">
                {/* Method 1: Doctor / Midwife date */}
                <label
                  onClick={() => setMethod('doctor')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    method === 'doctor'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="dueDateMethod"
                    checked={method === 'doctor'}
                    onChange={() => setMethod('doctor')}
                    className="mt-1 text-[#88A04D] focus:ring-[#88A04D]"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#233125] block">
                      {t('គ្រូពេទ្យ ឬឆ្មបបានប្រាប់ថ្ងៃសម្រាលខ្ញុំ', 'My doctor or midwife gave me a date')}
                    </span>
                    <span className="text-[11px] text-[#5F6E60] block mt-0.5">
                      {t('ការកំណត់តាមអេកូសាស្ត្រដំបូង ឬវេជ្ជបណ្ឌិតមានភាពសុក្រឹតបំផុត', 'Early ultrasound or doctor estimate is most accurate')}
                    </span>
                  </div>
                </label>

                {/* Method 2: First day of LMP */}
                <label
                  onClick={() => setMethod('lmp')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    method === 'lmp'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="dueDateMethod"
                    checked={method === 'lmp'}
                    onChange={() => setMethod('lmp')}
                    className="mt-1 text-[#88A04D] focus:ring-[#88A04D]"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#233125] block">
                      {t('ថ្ងៃដំបូងនៃរដូវចុងក្រោយ (LMP)', 'First day of my last period')}
                    </span>
                    <span className="text-[11px] text-[#5F6E60] block mt-0.5">
                      {t('គណនាតាមរូបមន្តស្តង់ដារ ២៨០ ថ្ងៃ + ប្រវែងវដ្តរដូវ', 'Calculated using standard 280-day cycle')}
                    </span>
                  </div>
                </label>

                {/* Method 3: Conception Date */}
                <label
                  onClick={() => setMethod('conception')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    method === 'conception'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="dueDateMethod"
                    checked={method === 'conception'}
                    onChange={() => setMethod('conception')}
                    className="mt-1 text-[#88A04D] focus:ring-[#88A04D]"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#233125] block">
                      {t('ខ្ញុំដឹងថ្ងៃបង្កកំណើត (Conception)', 'I know my conception date')}
                    </span>
                    <span className="text-[11px] text-[#5F6E60] block mt-0.5">
                      {t('គណនាតាមរូបមន្ត ២៦៦ ថ្ងៃ', 'Calculated using 266 days post-conception')}
                    </span>
                  </div>
                </label>
              </div>

              {/* Input Inputs based on selected method */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5EADF] space-y-3">
                {method === 'doctor' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#233125] mb-1">
                      {t('ជ្រើសរើសថ្ងៃសម្រាលដែលគ្រូពេទ្យប្រាប់៖', 'Doctor/Midwife due date:')}
                    </label>
                    <input
                      type="date"
                      value={doctorDueDate}
                      onChange={(e) => setDoctorDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#88A04D]"
                    />
                  </div>
                )}

                {method === 'lmp' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#233125] mb-1">
                        {t('ថ្ងៃដំបូងនៃរដូវចុងក្រោយ (LMP)៖', 'First day of last period:')}
                      </label>
                      <input
                        type="date"
                        value={lmpDate}
                        onChange={(e) => setLmpDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#88A04D]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-[#233125]">
                          {t('ប្រវែងវដ្តរដូវ (Cycle length)៖', 'Cycle length:')}
                        </span>
                        <span className="font-mono font-bold text-[#5C7034]">
                          {cycleLength} {t('ថ្ងៃ', 'days')}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={21}
                        max={45}
                        value={cycleLength}
                        onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                        className="w-full accent-[#88A04D]"
                      />
                      <div className="flex justify-between text-[10px] text-[#5F6E60]">
                        <span>21 {t('ថ្ងៃ', 'days')}</span>
                        <span>28 {t('ថ្ងៃ (មធ្យម)', 'days (avg)')}</span>
                        <span>45 {t('ថ្ងៃ', 'days')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {method === 'conception' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#233125] mb-1">
                      {t('ថ្ងៃបង្កកំណើត (Conception date)៖', 'Conception date:')}
                    </label>
                    <input
                      type="date"
                      value={conceptionDate}
                      onChange={(e) => setConceptionDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CAD6BE] bg-[#FAF9F5] text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#88A04D]"
                    />
                  </div>
                )}
              </div>

              {/* Calculated Result Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EBF1E4] to-[#FAF9F5] border border-[#88A04D]/35 space-y-1.5 shadow-2xs">
                <span className="text-[11px] font-bold text-[#5C7034] uppercase tracking-wider block">
                  🌸 {t('លទ្ធផលប៉ាន់ស្មាន', 'Estimated Result')}
                </span>
                <p className="text-sm sm:text-base font-bold text-[#233125]">
                  {t(
                    `ថ្ងៃសម្រាលរបស់អ្នកគឺប្រហែល ${calculatedResult.eddIso} — អ្នកកំពុងស្ថិតនៅសប្ដាហ៍ទី ${calculatedResult.week}`,
                    `Your due date is about ${calculatedResult.eddIso} — you are about week ${calculatedResult.week}`
                  )}
                </p>
                <p className="text-[11px] text-[#5F6E60] italic">
                  {t(
                    'មានតែគ្រូពេទ្យ ឬឆ្មបរបស់អ្នកប៉ុណ្ណោះដែលអាចបញ្ជាក់ថ្ងៃសម្រាលពិតប្រាកដ។',
                    'Only your doctor or midwife can confirm your due date.'
                  )}
                </p>

                {/* How we calculate toggle */}
                <button
                  type="button"
                  onClick={() => setShowCalculationInfo(!showCalculationInfo)}
                  className="pt-1 text-xs text-[#88A04D] hover:text-[#5C7034] font-semibold inline-flex items-center gap-1 underline underline-offset-2"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{t('របៀបដែលយើងគណនា (ACOG & StatPearls)', 'How we calculate (ACOG & StatPearls)')}</span>
                </button>
              </div>

              {/* Calculation Explanation Dialog / Drawer */}
              {showCalculationInfo && (
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5EADF] text-xs text-[#233125] space-y-2 animate-fade-in">
                  <div className="font-bold text-[#5C7034]">
                    {t('រូបមន្តវេជ្ជសាស្ត្រស្តង់ដារ៖', 'Standard Clinical Formulas:')}
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[#5F6E60]">
                    <li>
                      <strong>LMP Rule (Naegele):</strong> LMP + 280 {t('ថ្ងៃ', 'days')} + (cycle − 28)
                    </li>
                    <li>
                      <strong>Conception:</strong> Conception + 266 {t('ថ្ងៃ', 'days')}
                    </li>
                    <li>
                      <strong>Gestational Age:</strong> 280 − {t('ថ្ងៃដែលនៅសល់ដល់ថ្ងៃសម្រាល', 'days until EDD')}
                    </li>
                  </ul>
                  <div className="pt-1 text-[11px] text-[#5F6E60] space-y-1 border-t border-[#E5EADF]">
                    <div>
                      📚 <strong>ACOG Committee Opinion No. 700:</strong>{' '}
                      <em>Methods for Estimating the Due Date</em> (2017, reaffirmed 2022).
                    </div>
                    <div>
                      📚 <strong>StatPearls NCBI:</strong> <em>Estimated Date of Delivery</em>.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* SCREEN 2: First Pregnancy */}
          {/* ================================================================= */}
          {screen === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#233125] font-serif leading-snug">
                  {t('តើនេះជាការមានផ្ទៃពោះលើកដំបូងរបស់អ្នកមែនទេ?', 'Is this your first pregnancy?')}
                </h3>
                <p className="text-xs text-[#5F6E60] mt-1">
                  {t(
                    'ព័ត៌មាននេះជួយឱ្យ «ម៉ែ» ផ្តល់ការណែនាំដែលត្រូវនឹងបទពិសោធន៍របស់អ្នក។',
                    'This helps ម៉ែ tailor guidance to your experience level.'
                  )}
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setFirstPregnancyChoice('yes')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    firstPregnancyChoice === 'yes'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌸</span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#233125] block">
                        {t('បាទ/ចាស នេះជាលើកដំបូងរបស់ខ្ញុំ', 'Yes, this is my first pregnancy')}
                      </span>
                      <span className="text-[11px] text-[#5F6E60]">
                        {t('យើងនឹងកំដរអ្នកមួយជំហានម្តងៗ', 'We will walk with you step by step')}
                      </span>
                    </div>
                  </div>
                  {firstPregnancyChoice === 'yes' && <Check className="w-5 h-5 text-[#88A04D]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setFirstPregnancyChoice('no')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    firstPregnancyChoice === 'no'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👶</span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#233125] block">
                        {t('ទេ ខ្ញុំធ្លាប់មានកូនពីមុនរួចហើយ', 'No, I have been pregnant before')}
                      </span>
                      <span className="text-[11px] text-[#5F6E60]">
                        {t('សូមប្រាប់ចំនួនកូនរបស់អ្នកខាងក្រោម', 'Please tell us how many children you have')}
                      </span>
                    </div>
                  </div>
                  {firstPregnancyChoice === 'no' && <Check className="w-5 h-5 text-[#88A04D]" />}
                </button>

                {/* Sub-question if No: How many children? */}
                {firstPregnancyChoice === 'no' && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#CAD6BE] space-y-2 animate-fade-in">
                    <label className="block text-xs font-semibold text-[#233125]">
                      {t('តើអ្នកមានកូនប៉ុន្មាននាក់ហើយ?', 'How many children do you have?')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setChildrenCount(num)}
                          className={`min-h-[44px] py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                            childrenCount === num
                              ? 'bg-[#88A04D] text-white border-[#88A04D] shadow-2xs'
                              : 'bg-[#FAF9F5] text-[#233125] border-[#E5EADF] hover:bg-white'
                          }`}
                        >
                          {num === 3 ? t('៣ នាក់ ឬច្រើនជាង', '3 or more') : t(`${num} នាក់`, `${num}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setFirstPregnancyChoice('prefer_not')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    firstPregnancyChoice === 'prefer_not'
                      ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E5EADF] hover:bg-white'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium text-[#5F6E60]">
                    {t('មិនបញ្ជាក់ (Prefer not to say)', 'Prefer not to say')}
                  </span>
                  {firstPregnancyChoice === 'prefer_not' && <Check className="w-4 h-4 text-[#88A04D]" />}
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SCREEN 3: Daily Life / Occupation (Optional) */}
          {/* ================================================================= */}
          {screen === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-[#233125] font-serif leading-snug">
                    {t('តើអ្វីដែលពិពណ៌នាអំពីជីវិតប្រចាំថ្ងៃរបស់អ្នកបានល្អបំផុត?', 'What best describes your daily life?')}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#88A04D] bg-[#EBF1E4] px-2 py-0.5 rounded-full shrink-0">
                    {t('ស្រេចចិត្ត', 'Optional')}
                  </span>
                </div>
                <p className="text-xs text-[#5F6E60] mt-1">
                  {t(
                    'ជួយឱ្យយើងណែនាំពីការសម្រាក និងសុវត្ថិភាពការងារដែលសមស្រប។',
                    'Helps us suggest suitable rest and workplace safety tips.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OCCUPATIONS.map((occ) => {
                  const isSelected = occupation === occ.kh || occupation === occ.en;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccupation(t(occ.kh, occ.en))}
                      className={`min-h-[46px] p-3 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#88A04D] ring-2 ring-[#88A04D]/20 font-bold text-[#233125] shadow-xs'
                          : 'bg-[#FAF9F5] border-[#E5EADF] text-[#5F6E60] hover:text-[#233125] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{t(occ.kh, occ.en)}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#88A04D] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E5EADF] flex items-center justify-between shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {screen > 1 ? (
            <button
              type="button"
              onClick={() => setScreen((prev) => (prev - 1) as 1 | 2)}
              className="min-h-[44px] px-4 py-2 rounded-full border border-[#E5EADF] text-xs font-semibold text-[#233125] hover:bg-[#FAF9F5] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('ត្រឡប់ក្រោយ', 'Back')}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {/* Skip option for optional screens */}
            {screen === 3 && (
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold text-[#5F6E60] hover:text-[#233125] transition-colors"
              >
                {t('រំលង', 'Skip')}
              </button>
            )}

            {screen === 1 && (
              <button
                type="button"
                onClick={handleNextFromScreen1}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>{t('បន្ទាប់', 'Next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {screen === 2 && (
              <button
                type="button"
                onClick={handleNextFromScreen2}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>{t('បន្ទាប់', 'Next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {screen === 3 && (
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>{t('បញ្ចប់ 🌸', 'Finish 🌸')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
