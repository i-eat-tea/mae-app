/**
 * ម៉ែ — by FlowErs
 * Entitlements & Access Rules Engine
 *
 * Rules:
 * - Free: Browse, journey, baby card, due date calculator, and up to 2 different
 *   summaries per day (reset at midnight Asia/Phnom_Penh).
 * - Safety-Critical & PSI Voice: Items marked `is_safety_critical` and all PSI
 *   voice messages are ALWAYS 100% free and NEVER counted against the daily limit.
 * - Re-opening: Opening the same summary multiple times in the same day does not count again.
 * - Premium (Entitlements table): My Plan features (adding items to routine,
 *   converting to reminders, calendar export, and morning Telegram alerts).
 * - Edit `FREE_LIMITS.dailySummaries` to change the daily summary cap (set to 0 for unlimited).
 */

export interface FreeLimitsConfig {
  /**
   * Maximum different non-safety-critical summaries a free user can open per calendar day.
   * Setting this to 0 turns off the daily limit (unlimited free summaries).
   */
  dailySummaries: number;
}

export const FREE_LIMITS: FreeLimitsConfig = {
  dailySummaries: 2, // Set to 0 to disable the limit (unlimited)
};

export type SummaryAccessResult =
  | { allowed: true }
  | { allowed: false; reason: 'daily_limit' };

export type FeatureAccessResult = {
  allowed: boolean;
};

export interface ResourceSummaryItem {
  id: string;
  is_safety_critical?: boolean;
}

/**
 * Gets the current date string in Asia/Phnom_Penh timezone (YYYY-MM-DD).
 */
export function getCambodiaDateStr(d: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    // Fallback in case Intl timeZone is unsupported
    const offsetDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    return offsetDate.toISOString().slice(0, 10);
  }
}

/**
 * Calculates remaining hours and minutes until midnight in Asia/Phnom_Penh timezone.
 */
export function getTimeUntilMidnightCambodia(): { hours: number; minutes: number; formattedKh: string; formattedEn: string } {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Phnom_Penh',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const second = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

    const secondsPassed = hour * 3600 + minute * 60 + second;
    const secondsRemaining = Math.max(0, 86400 - secondsPassed);

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    return {
      hours,
      minutes,
      formattedKh: `${hours} ម៉ោង ${minutes} នាទី`,
      formattedEn: `${hours}h ${minutes}m`,
    };
  } catch {
    return {
      hours: 12,
      minutes: 0,
      formattedKh: '12 ម៉ោង',
      formattedEn: '12 hours',
    };
  }
}

/**
 * Pure evaluation function for summary access.
 *
 * Rules:
 * 1. If user is premium -> Allowed.
 * 2. If FREE_LIMITS.dailySummaries is 0 -> Cap is disabled -> Allowed.
 * 3. If resource is marked safety-critical -> Always allowed and never counted.
 * 4. If resource was already opened today -> Re-opening is allowed and does not consume quota.
 * 5. If today's opened summaries count is less than FREE_LIMITS.dailySummaries -> Allowed.
 * 6. Otherwise -> Blocked with reason 'daily_limit'.
 */
export function canOpenSummary(
  resource: ResourceSummaryItem,
  isPremium: boolean = false,
  openedTodaySummaryIds: string[] = []
): SummaryAccessResult {
  // Rule 1: Premium users have unlimited access to all summaries
  if (isPremium) {
    return { allowed: true };
  }

  // Rule 2: If cap is set to 0, limit is turned off
  if (FREE_LIMITS.dailySummaries <= 0) {
    return { allowed: true };
  }

  // Rule 3: Warning signs and safety-critical resources are always free
  if (resource.is_safety_critical) {
    return { allowed: true };
  }

  // Rule 4: Re-opening the same summary today is always free
  if (openedTodaySummaryIds.includes(resource.id)) {
    return { allowed: true };
  }

  // Rule 5: Free daily allowance check (up to dailySummaries)
  if (openedTodaySummaryIds.length < FREE_LIMITS.dailySummaries) {
    return { allowed: true };
  }

  // Rule 6: Limit reached
  return { allowed: false, reason: 'daily_limit' };
}

/**
 * Rule: My Plan features (adding items, personal routine) require premium.
 */
export function canUsePlan(isPremium: boolean = false): FeatureAccessResult {
  return { allowed: isPremium };
}

/**
 * Rule: Reminder features (in-app, Telegram, calendar export) require premium.
 */
export function canUseReminders(isPremium: boolean = false): FeatureAccessResult {
  return { allowed: isPremium };
}

/**
 * Generates a temporary single-use Telegram connection token (e.g. FLOW-7K29).
 * Cryptographically random, 15-minute validity, case-insensitive.
 */
export function generateTelegramConnectionCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(bytes[i] % chars.length);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return `FLOW-${randomPart}`;
}
