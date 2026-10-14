/**
 * ម៉ែ — by FlowErs
 * Due Date Calculator & Gestational Age Calculation (Pure Functions)
 *
 * Sources & Clinical Reference:
 * 1. ACOG Committee Opinion No. 700: "Methods for Estimating the Due Date" (2017, reaffirmed 2022).
 *    https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date
 * 2. StatPearls: "Estimated Date of Delivery" (National Center for Biotechnology Information).
 *    https://www.ncbi.nlm.nih.gov/books/NBK536986/
 *
 * Formulas:
 * - LMP rule (Naegele's rule equivalent): EDD = LMP + 280 days + (cycle length − 28) days
 * - Conception rule: EDD = Conception + 266 days
 * - LMP from EDD: LMP = EDD − 280 days
 * - Gestational age: totalDays = 280 − (days from today to EDD); completed weeks = floor(totalDays / 7)
 * - appWeek (week in progress convention): completed weeks + 1, clamped to 1–40.
 *
 * Timezone: Asia/Phnom_Penh (calendar dates only, no local time drift).
 */

export interface GestationalAgeResult {
  weeks: number;
  days: number;
  totalDays: number;
}

/**
 * Parses a Date or YYYY-MM-DD string into a normalized UTC noon Date
 * to prevent calendar date shifting across timezones.
 */
export function parseDateString(dateInput: Date | string): Date {
  if (typeof dateInput === 'string') {
    const clean = dateInput.split('T')[0].trim();
    const parts = clean.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }
  }
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0));
}

/**
 * Formats a Date object to YYYY-MM-DD ISO calendar string.
 */
export function formatDateToIsoDate(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's calendar date in Cambodia (Asia/Phnom_Penh timezone).
 */
export function getCambodiaToday(): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return parseDateString(formatter.format(now));
}

/**
 * Adds an integer number of days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Calculate Estimated Date of Delivery (EDD) from Last Menstrual Period (LMP).
 * Formula: LMP + 280 days + (cycleLength − 28) days
 * Test case 1: LMP 2026-01-01 with cycle 28 -> 2026-10-08
 * Test case 2: LMP 2026-01-01 with cycle 35 -> 2026-10-15
 */
export function eddFromLmp(lmp: Date | string, cycleLength = 28): Date {
  const baseDate = parseDateString(lmp);
  const adjustedCycle = Math.max(21, Math.min(45, cycleLength));
  const daysToAdd = 280 + (adjustedCycle - 28);
  return addDays(baseDate, daysToAdd);
}

/**
 * Calculate EDD from Conception Date.
 * Formula: Conception date + 266 days
 * Test case 3: Conception 2026-01-15 -> 2026-10-08
 */
export function eddFromConception(date: Date | string): Date {
  const baseDate = parseDateString(date);
  return addDays(baseDate, 266);
}

/**
 * Reverse calculate LMP from EDD.
 * Formula: EDD − 280 days
 */
export function lmpFromEdd(edd: Date | string): Date {
  const baseDate = parseDateString(edd);
  return addDays(baseDate, -280);
}

/**
 * Gestational age from EDD and today's date.
 * totalDays = 280 − (days from today to EDD)
 * weeks = floor(totalDays / 7)
 * days = totalDays % 7
 */
export function gestationalAge(
  edd: Date | string,
  today: Date | string = getCambodiaToday()
): GestationalAgeResult {
  const eddDate = parseDateString(edd);
  const todayDate = parseDateString(today);
  const diffMs = eddDate.getTime() - todayDate.getTime();
  const daysUntilEdd = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const totalDays = 280 - daysUntilEdd;
  const safeTotalDays = Math.max(0, Math.min(294, totalDays));
  const weeks = Math.floor(safeTotalDays / 7);
  const days = safeTotalDays % 7;
  return { weeks, days, totalDays: safeTotalDays };
}

/**
 * App pregnancy week convention ("week in progress"):
 * appWeek = completed weeks + 1, clamped to 1–40.
 * (Note: Week 0 completed is Week 1 in progress; Week 39 completed is Week 40).
 */
export function appWeek(
  edd: Date | string,
  today: Date | string = getCambodiaToday()
): number {
  const { weeks } = gestationalAge(edd, today);
  const currentWeekInProgress = weeks + 1;
  return Math.max(1, Math.min(40, currentWeekInProgress));
}

/**
 * Validation rules:
 * - LMP between today − 300 days and today
 * - Due date between today and today + 300 days
 * - Cycle length between 21 and 45 days
 */
export function validateLmp(
  lmp: Date | string,
  today: Date | string = getCambodiaToday()
): { valid: boolean; errorKey?: string } {
  const lmpDate = parseDateString(lmp);
  const todayDate = parseDateString(today);
  const diffDays = Math.round((todayDate.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { valid: false, errorKey: 'lmp_in_future' };
  }
  if (diffDays > 300) {
    return { valid: false, errorKey: 'lmp_too_old' };
  }
  return { valid: true };
}

export function validateEdd(
  edd: Date | string,
  today: Date | string = getCambodiaToday()
): { valid: boolean; errorKey?: string } {
  const eddDate = parseDateString(edd);
  const todayDate = parseDateString(today);
  const diffDays = Math.round((eddDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < -14) {
    return { valid: false, errorKey: 'edd_in_past' };
  }
  if (diffDays > 300) {
    return { valid: false, errorKey: 'edd_too_far' };
  }
  return { valid: true };
}

export function validateCycleLength(cycleLength: number): boolean {
  return Number.isInteger(cycleLength) && cycleLength >= 21 && cycleLength <= 45;
}
