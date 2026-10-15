/**
 * ម៉ែ — by FlowErs
 * Application State Management
 *
 * Khmer-first, Cambodia-first pregnancy companion for first-time mothers.
 * Manages user session, monthly voice messages, weekly stage focus
 * ("អ្វីដែលអ្នកអាចយកចិត្តទុកដាក់"), curated resources library,
 * reading progress tracker, and telemetry (only after the user consents).
 *
 * Voice: "ម៉ែ" (Mom) is the app's NAME only. The app is a companion, not the
 * user's mother. Address the user as "you" (អ្នក), never as "កូន" (child).
 *
 * LIVE-DATA NOTES:
 * - There is no demo account. Every user signs up for real.
 * - signup() / login() / logout() use Supabase Auth (email + password). Testers may
 *   use a made-up email: nothing is ever sent to it. The profile (name, week, etc.)
 *   is saved to the Supabase `users` table, one row per person.
 * - Analytics events are only recorded when analyticsConsent === 'granted'.
 * - Resources are loaded from the Supabase `resources` table (Published rows).
 *   The local list is kept as a fallback for weak or missing internet.
 * - Analytics events are saved to localStorage AND the Supabase
 *   `analytics_events` table (only after consent).
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserLanguage,
  NotificationPreference,
  PregnancyResource,
  FocusTopic,
  MonthlyMessage,
  AnalyticsEvent,
  AnalyticsEventType,
} from '../types';
import { INITIAL_PREGNANCY_RESOURCES } from '../data/resources';
import {
  getMonthlyMessageForWeek,
  getFocusTopicsForMonth,
  MONTHLY_MOM_MESSAGES,
} from '../data/monthlyMessages';
import { supabase } from '../lib/supabase';
import { getSavedPreLoginAnswers, clearPreLoginAnswers } from '../components/PreLoginWizard';
import {
  FREE_LIMITS,
  canOpenSummary as evaluateCanOpenSummary,
  canUsePlan as evaluateCanUsePlan,
  canUseReminders as evaluateCanUseReminders,
  getCambodiaDateStr,
  SummaryAccessResult,
  FeatureAccessResult,
  ResourceSummaryItem,
} from '../lib/entitlements';

const STORAGE_KEY_USER = 'mae_user_session';
const STORAGE_KEY_RESOURCES = 'mae_resources_catalog_v3';
const STORAGE_KEY_READ_RESOURCES = 'mae_read_resources';
const STORAGE_KEY_ANALYTICS = 'mae_analytics_events';
const STORAGE_KEY_LANG = 'mae_user_lang';
const STORAGE_KEY_CONSENT = 'mae_analytics_consent';

export type TabKey = 'home' | 'journey' | 'plan' | 'explore' | 'profile' | 'resources';

/** 'unset' = the user has not answered the cookie/data banner yet (nothing is tracked). */
export type ConsentStatus = 'unset' | 'granted' | 'denied';

interface AppContextType {
  // Language & Localization (Khmer first)
  language: UserLanguage;
  setLanguage: (lang: UserLanguage) => void;
  toggleLanguage: () => void;
  t: (km?: string, en?: string) => string;

  // User Session
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserPreferences: (updates: Partial<User>) => void;

  // Onboarding
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (data: {
    name: string;
    pregnancy_week: number;
    due_date?: string;
    language: UserLanguage;
    notification_preference: NotificationPreference;
  }) => void;

  // Week, Month & Guidance
  currentWeek: number;
  currentMonth: number;
  setCurrentWeek: (week: number) => void;
  monthlyMessage: MonthlyMessage;
  focusTopics: FocusTopic[];
  monthlyMessagesList: MonthlyMessage[];

  // Resources (Curated Library & Team Content Entry)
  resources: PregnancyResource[];
  addResource: (res: Omit<PregnancyResource, 'id' | 'createdAt' | 'updatedAt'>) => PregnancyResource;
  updateResource: (id: string, updates: Partial<PregnancyResource>) => void;
  deleteResource: (id: string) => void;
  resetDefaultResources: () => void;
  getResourceById: (id: string) => PregnancyResource | undefined;

  // Reading Progress Tracker
  readResourceIds: string[];
  markResourceAsRead: (id: string, options?: { showUndoToast?: boolean }) => void;
  toggleResourceRead: (id: string) => void;
  isResourceRead: (id: string) => boolean;
  resetReadProgress: () => void;

  // Modals & Navigation
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  selectedResource: PregnancyResource | null;
  setSelectedResource: (res: PregnancyResource | null) => void;
  selectedTopic: FocusTopic | null;
  setSelectedTopic: (topic: FocusTopic | null) => void;
  isContentEntryOpen: boolean;
  setIsContentEntryOpen: (open: boolean) => void;
  editingResource: PregnancyResource | null;
  setEditingResource: (res: PregnancyResource | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;

  // Data & cookie consent
  analyticsConsent: ConsentStatus;
  setAnalyticsConsent: (status: 'granted' | 'denied') => void;

  // Analytics (recorded only when consent is granted)
  analyticsEvents: AnalyticsEvent[];
  logEvent: (
    eventName: AnalyticsEventType,
    contentId?: string,
    pregnancyWeek?: number,
    metadata?: Record<string, unknown>
  ) => void;
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  clearAnalytics: () => void;
  deleteMyData: () => Promise<{ success: boolean; error?: string }>;

  // Toast Notification
  toastMessage: string | null;
  toastAction: { label: string; onClick: () => void } | null;
  showToast: (msg: string, action?: { label: string; onClick: () => void }) => void;

  // Premium & Upgrade Modal
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean, source?: string) => void;
  upgradeModalSource: string;
  isPremium: boolean;
  canOpenSummary: (resource: ResourceSummaryItem) => SummaryAccessResult;
  canUsePlan: () => FeatureAccessResult;
  canUseReminders: () => FeatureAccessResult;
  trackOpenedSummary: (resource: ResourceSummaryItem) => Promise<void>;
  todayOpenedSummaries: string[];
  dailySummariesLimit: number;
  dailySummariesRemaining: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Converts a Supabase row (title_kh) into the shape the app uses (titleKh). */
const rowToResource = (row: any): PregnancyResource =>
  ({
    id: row.id,
    titleKh: row.title_kh,
    titleEn: row.title_en,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    category: row.category,
    pregnancyStage: row.pregnancy_stage,
    pregnancyWeeks: row.pregnancy_weeks ?? [],
    summaryKh: row.summary_kh,
    summaryEn: row.summary_en,
    summaryPurpose: row.summary_purpose,
    weeklyFocus: row.weekly_focus,
    status: row.status,
    title: row.title_kh,
    summary: row.summary_kh,
    planSuggestions: row.plan_suggestions ?? [],
    audioUrl: row.audio_url,
    audioTranscriptKh: row.audio_transcript_kh,
    audioTranscriptEn: row.audio_transcript_en,
    audioDuration: row.audio_duration,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  }) as PregnancyResource;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State - Default to 'km' (Khmer first)
  const [language, setLanguageState] = useState<UserLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LANG);
      if (stored === 'en' || stored === 'km') return stored;
    } catch {}
    return 'km'; // Khmer by default
  });

  const setLanguage = (lang: UserLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {}
    if (user) {
      updateUserPreferences({ language: lang });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'km' ? 'en' : 'km');
  };

  const t = (km?: string, en?: string) => (language === 'km' ? (km ?? en ?? '') : (en ?? km ?? ''));

  // 2. User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 3. Resources State (allows team to add/edit/delete resources)
  const [resources, setResources] = useState<PregnancyResource[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PREGNANCY_RESOURCES;
  });

  // 4. Data & cookie consent (nothing is tracked until this is 'granted')
  const [analyticsConsent, setAnalyticsConsentState] = useState<ConsentStatus>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONSENT);
      if (stored === 'granted' || stored === 'denied') return stored;
    } catch {}
    return 'unset';
  });

  // 5. Analytics Events State
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANALYTICS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 6. Read Resources State (for visual progress tracker)
  const [readResourceIds, setReadResourceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_READ_RESOURCES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI States
  const [currentWeek, setCurrentWeek] = useState<number>(() => user?.pregnancy_week || 9);
  const [activeTab, setActiveTabState] = useState<TabKey>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [selectedResource, setSelectedResource] = useState<PregnancyResource | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<FocusTopic | null>(null);
  const [isContentEntryOpen, setIsContentEntryOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<PregnancyResource | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpenState] = useState(false);
  const [upgradeModalSource, setUpgradeModalSource] = useState<string>('plan_feature');

  const setIsUpgradeModalOpen = (open: boolean, source?: string) => {
    if (source) setUpgradeModalSource(source);
    setIsUpgradeModalOpenState(open);
  };

  // Entitlements: Daily usage tracking (reset at midnight Asia/Phnom_Penh)
  const [todayOpenedSummaries, setTodayOpenedSummaries] = useState<string[]>(() => {
    try {
      const todayStr = getCambodiaDateStr();
      const stored = localStorage.getItem('mae_daily_usage_' + todayStr);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);
  const toastTimerRef = React.useRef<any>(null);

  const setActiveTab = (tab: TabKey) => {
    const target = tab === 'resources' ? 'explore' : tab;
    setActiveTabState(target);
    if (target === 'journey') {
      logEvent('journey_opened', undefined, currentWeek);
    } else if (target === 'explore') {
      logEvent('explore_opened', undefined, currentWeek);
    }
  };

  // Derive month (1 to 9) from currentWeek
  const currentMonth = useMemo(() => {
    if (currentWeek <= 4) return 1;
    if (currentWeek <= 8) return 2;
    if (currentWeek <= 12) return 3;
    if (currentWeek <= 16) return 4;
    if (currentWeek <= 20) return 5;
    if (currentWeek <= 24) return 6;
    if (currentWeek <= 28) return 7;
    if (currentWeek <= 34) return 8;
    return 9;
  }, [currentWeek]);

  // Derive the monthly voice message for the current week
  const monthlyMessage = useMemo(() => {
    return getMonthlyMessageForWeek(currentWeek);
  }, [currentWeek]);

  // Derive small focus topics for current month/stage
  const focusTopics = useMemo(() => {
    return getFocusTopicsForMonth(currentMonth);
  }, [currentMonth]);

  // Sync user changes to localStorage & update week
  // TODO(database): replace with a call to your database client (e.g. Supabase / Firebase).
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        if (user.pregnancy_week) {
          setCurrentWeek(user.pregnancy_week);
        }
        if (user.language) {
          setLanguageState(user.language);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [user]);

  // Load published resources from Supabase. If it fails (weak signal), the
  // cached or built-in list already in state stays in place.
  useEffect(() => {
    supabase
      .from('resources')
      .select('*')
      .eq('status', 'Published')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          if (error) console.warn('Could not load resources', error.message);
          return;
        }
        const order = INITIAL_PREGNANCY_RESOURCES.map((r) => r.id);
        const rank = (id: string) => {
          const i = order.indexOf(id);
          return i === -1 ? 999 : i;
        };
        const mapped = data.map(rowToResource).sort((a, b) => rank(a.id) - rank(b.id));
        setResources(mapped);
      });
  }, []);

  // Entitlements & Session Sync:
  // - Premium status comes from the `entitlements` table (is_premium). No row means not premium.
  // - Count today's opened summaries from `daily_usage` table (or localStorage for guests).
  useEffect(() => {
    const loadTodayDailyUsage = async (userId: string) => {
      const todayStr = getCambodiaDateStr();
      try {
        const { data: usageRow, error: usageError } = await supabase
          .from('daily_usage')
          .select('summary_ids')
          .eq('user_id', userId)
          .eq('date', todayStr)
          .maybeSingle();

        if (!usageError && usageRow && Array.isArray(usageRow.summary_ids)) {
          setTodayOpenedSummaries(usageRow.summary_ids);
          try {
            localStorage.setItem('mae_daily_usage_' + todayStr, JSON.stringify(usageRow.summary_ids));
          } catch {}
          return;
        }
      } catch (err) {
        console.warn('Could not load daily usage from database', err);
      }

      // Fallback from localStorage
      try {
        const local = localStorage.getItem('mae_daily_usage_' + todayStr);
        if (local) {
          setTodayOpenedSummaries(JSON.parse(local));
        }
      } catch {}
    };

    const refreshProfile = async (userId: string, userEmail?: string) => {
      // 1. Fetch user row
      const { data: row } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // 2. Premium status comes from the entitlements table (is_premium). No row means not premium.
      let isUserPremium = false;
      try {
        const { data: entRow, error: entError } = await supabase
          .from('entitlements')
          .select('is_premium')
          .eq('user_id', userId)
          .maybeSingle();

        if (!entError && entRow) {
          isUserPremium = Boolean(entRow.is_premium);
        } else if (row?.is_premium) {
          // Backward compatibility fallback if manual switch was placed in users table
          isUserPremium = true;
        }
      } catch {
        isUserPremium = Boolean(row?.is_premium);
      }

      if (row) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: row.name || prev.name,
                is_premium: isUserPremium,
                pregnancy_week: row.pregnancy_week || prev.pregnancy_week,
                due_date: row.due_date || prev.due_date,
                tier: isUserPremium ? 'premium' : 'free',
              }
            : {
                id: userId,
                name: row.name || userEmail?.split('@')[0] || 'User',
                email: userEmail || '',
                language: row.language || 'km',
                pregnancy_week: row.pregnancy_week || 9,
                due_date: row.due_date || undefined,
                due_date_method: row.due_date_method || undefined,
                lmp_date: row.lmp_date || undefined,
                occupation: row.occupation || undefined,
                is_first_pregnancy: row.is_first_pregnancy !== undefined ? row.is_first_pregnancy : true,
                children_count: row.children_count || undefined,
                notification_preference: row.notification_preference || 'weekly',
                is_premium: isUserPremium,
                tier: isUserPremium ? 'premium' : 'free',
                premium_until: row.premium_until || undefined,
                created_at: row.created_at || new Date().toISOString(),
              }
        );
      }

      // Load today's opened summaries from daily_usage table
      loadTodayDailyUsage(userId);
    };

    supabase.auth?.getSession?.()?.then(({ data }: any) => {
      if (!data?.session) {
        setUser((prev) => (prev ? null : prev));
        // Guest user: load from localStorage for today
        const todayStr = getCambodiaDateStr();
        try {
          const local = localStorage.getItem('mae_daily_usage_' + todayStr);
          if (local) {
            setTodayOpenedSummaries(JSON.parse(local));
          }
        } catch {}
      } else {
        refreshProfile(data.session.user.id, data.session.user.email);
      }
    });

    const authSub = supabase.auth?.onAuthStateChange?.((_event: any, session: any) => {
      if (session?.user) {
        refreshProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
      }
    });

    return () => {
      authSub?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  // Sync resources to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Resources storage sync error', e);
    }
  }, [resources]);

  // Sync analytics to localStorage (a local copy for the in-app research panel)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(analyticsEvents));
    } catch (e) {
      console.warn('Analytics storage sync error', e);
    }
  }, [analyticsEvents]);

  // Sync read resources to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_READ_RESOURCES, JSON.stringify(readResourceIds));
    } catch (e) {
      console.warn('Read resources storage sync error', e);
    }
  }, [readResourceIds]);

  // Load user's reading progress from Supabase user_read_resources table on login/mount
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_read_resources')
      .select('resource_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          const ids = data.map((r: any) => r.resource_id).filter(Boolean);
          if (ids.length > 0) {
            setReadResourceIds((prev) => Array.from(new Set([...prev, ...ids])));
          }
        }
      });
  }, [user?.id]);

  // Toast notification helper with auto-clear and optional undo action
  const showToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastAction(action || null);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, action ? 6000 : 3800);
  };

  // Data & cookie consent. Declining also wipes anything already recorded locally.
  const setAnalyticsConsent = (status: 'granted' | 'denied') => {
    setAnalyticsConsentState(status);
    try {
      localStorage.setItem(STORAGE_KEY_CONSENT, status);
    } catch {}
    if (status === 'denied') {
      setAnalyticsEvents([]);
      try {
        localStorage.removeItem(STORAGE_KEY_ANALYTICS);
      } catch {}
    }
  };

  // Analytics event logger. Records nothing unless the user has agreed.
  const logEvent = (
    eventName: AnalyticsEventType,
    contentId?: string,
    pregnancyWeek?: number,
    metadata?: Record<string, unknown>
  ) => {
    if (analyticsConsent !== 'granted') return;
    const newEvent: AnalyticsEvent = {
      id: 'evt_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      userId: user?.id || 'guest_user',
      eventName,
      contentId,
      pregnancyWeek: pregnancyWeek ?? currentWeek,
      timestamp: new Date().toISOString(),
      metadata,
    };
    setAnalyticsEvents((prev) => [newEvent, ...prev.slice(0, 199)]);

    // Also save to the Supabase analytics_events table
    supabase
      .from('analytics_events')
      .insert({
        user_id: newEvent.userId,
        event_name: eventName,
        content_id: contentId ?? null,
        pregnancy_week: newEvent.pregnancyWeek,
        metadata: metadata ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn('Analytics save failed', error.message);
      });
  };

  const clearAnalytics = () => {
    setAnalyticsEvents([]);
    try {
      localStorage.removeItem(STORAGE_KEY_ANALYTICS);
    } catch {}
    showToast(t('បានសម្អាតទិន្នន័យស្រាវជ្រាវ', 'Research data cleared.'));
  };

  // Saves the profile fields to the Supabase users table (the person's own row only).
  const saveProfile = async (u: User) => {
    const { error } = await supabase.from('users').upsert({
      id: u.id,
      name: u.name,
      language: u.language,
      pregnancy_week: u.pregnancy_week,
      due_date: u.due_date || null,
      due_date_method: u.due_date_method || null,
      lmp_date: u.lmp_date || null,
      occupation: u.occupation || null,
      is_first_pregnancy: u.is_first_pregnancy !== undefined ? u.is_first_pregnancy : null,
      children_count: u.children_count !== undefined ? u.children_count : null,
      notification_preference: u.notification_preference,
      tier: u.tier || 'free',
      premium_until: u.premium_until || null,
    });
    if (error) console.warn('Profile save failed', error.message);
  };

  // Authentication Flows (Supabase Auth, email + password)
  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) return { success: false, error: t('សូមបញ្ចូលឈ្មោះរបស់អ្នក។', 'Please enter your name.') };
    if (!email.includes('@')) return { success: false, error: t('សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។', 'Please enter a valid email address.') };
    if (pass.length < 6) return { success: false, error: t('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។', 'Password must be at least 6 characters.') };

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password: pass });
    if (error || !data.user) {
      return { success: false, error: error?.message || t('មិនអាចបង្កើតគណនីបានទេ។', 'Could not create the account.') };
    }
    if (!data.session) {
      return {
        success: false,
        error: 'Account created, but Supabase still wants email confirmation. Turn off "Confirm email" in Authentication.',
      };
    }

    // Retrieve pre-login wizard answers from local memory if available
    const wizardAnswers = getSavedPreLoginAnswers();
    const calculatedWeek = wizardAnswers?.calculatedWeek || 9;

    const newUser: User = {
      id: data.user.id,
      name: name.trim(),
      email: cleanEmail,
      language: language || 'km',
      pregnancy_week: calculatedWeek,
      due_date: wizardAnswers?.dueDate,
      due_date_method: wizardAnswers?.dueDateMethod,
      lmp_date: wizardAnswers?.lmpDate,
      occupation: wizardAnswers?.occupation,
      is_first_pregnancy: wizardAnswers?.isFirstPregnancy,
      children_count: wizardAnswers?.childrenCount,
      notification_preference: 'weekly',
      is_premium: false,
      tier: 'free',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    setCurrentWeek(calculatedWeek);
    saveProfile(newUser);
    clearPreLoginAnswers();

    logEvent('account_created', newUser.id, calculatedWeek);
    logEvent('signup_completed', newUser.id, calculatedWeek);
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(true);
    showToast(t(`សូមស្វាគមន៍មកកាន់ «ម៉ែ», ${newUser.name} 🌸`, `Welcome to ម៉ែ, ${newUser.name} 🌸`));
    return { success: true };
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.includes('@')) return { success: false, error: t('សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។', 'Please enter a valid email address.') };
    if (!pass) return { success: false, error: t('សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក។', 'Please enter your password.') };

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: pass });
    if (error || !data.user) {
      return { success: false, error: t('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។', 'Wrong email or password.') };
    }

    const { data: row } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();

    // Query entitlements table (no row means not premium)
    let isUserPremium = false;
    try {
      const { data: entRow, error: entError } = await supabase
        .from('entitlements')
        .select('is_premium')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (!entError && entRow) {
        isUserPremium = Boolean(entRow.is_premium);
      } else if (row?.is_premium) {
        isUserPremium = true;
      }
    } catch {
      isUserPremium = Boolean(row?.is_premium);
    }

    const returningUser: User = {
      id: data.user.id,
      name: row?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      language: row?.language || language || 'km',
      pregnancy_week: row?.pregnancy_week || 9,
      due_date: row?.due_date || undefined,
      due_date_method: row?.due_date_method || undefined,
      lmp_date: row?.lmp_date || undefined,
      occupation: row?.occupation || undefined,
      is_first_pregnancy: row?.is_first_pregnancy !== undefined ? row.is_first_pregnancy : true,
      children_count: row?.children_count || undefined,
      notification_preference: row?.notification_preference || 'weekly',
      is_premium: isUserPremium,
      tier: isUserPremium ? 'premium' : 'free',
      premium_until: row?.premium_until || undefined,
      created_at: row?.created_at || new Date().toISOString(),
    };

    // Load today's opened summaries from daily_usage
    const todayStr = getCambodiaDateStr();
    try {
      const { data: usageRow } = await supabase
        .from('daily_usage')
        .select('summary_ids')
        .eq('user_id', data.user.id)
        .eq('date', todayStr)
        .maybeSingle();

      if (usageRow && Array.isArray(usageRow.summary_ids)) {
        setTodayOpenedSummaries(usageRow.summary_ids);
        try {
          localStorage.setItem('mae_daily_usage_' + todayStr, JSON.stringify(usageRow.summary_ids));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not load daily usage on login', err);
    }

    setUser(returningUser);
    if (returningUser.pregnancy_week) {
      setCurrentWeek(returningUser.pregnancy_week);
    }
    logEvent('login_completed', returningUser.id, returningUser.pregnancy_week);
    setIsAuthModalOpen(false);
    showToast(t(`សូមស្វាគមន៍ការត្រឡប់មកវិញ 🌸`, `Welcome back, Mama 🌸`));
    return { success: true };
  };

  const logout = () => {
    logEvent('logout_completed', user?.id);
    supabase.auth.signOut();
    setUser(null);
    setCurrentWeek(9);
    setActiveTabState('home');
    showToast(t('អ្នកបានចាកចេញដោយសុវត្ថិភាព។ ថែរក្សាសុខភាពណា 🌸', 'You have logged out peacefully. Take care 🌸'));
  };

  const updateUserPreferences = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    saveProfile(updated);
    if (updates.pregnancy_week) {
      setCurrentWeek(updates.pregnancy_week);
      logEvent('pregnancy_week_selected', undefined, updates.pregnancy_week);
    }
    if (updates.language) {
      setLanguageState(updates.language);
    }
    if (updates.notification_preference) {
      logEvent('notification_preference_selected', undefined, undefined, {
        preference: updates.notification_preference,
      });
    }
    logEvent('profile_updated', user.id);
    showToast(t('បានកែប្រែព័ត៌មានដោយជោគជ័យ។', 'Preferences updated gently.'));
  };

  const completeOnboarding = (data: {
    name: string;
    pregnancy_week: number;
    due_date?: string;
    language: UserLanguage;
    notification_preference: NotificationPreference;
  }) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      name: data.name || user.name,
      pregnancy_week: data.pregnancy_week,
      due_date: data.due_date,
      language: data.language,
      notification_preference: data.notification_preference,
    };
    setUser(updatedUser);
    saveProfile(updatedUser);
    setLanguageState(data.language);
    setCurrentWeek(data.pregnancy_week);
    setIsOnboardingOpen(false);
    logEvent('onboarding_completed', user.id, data.pregnancy_week, {
      language: data.language,
      reminders: data.notification_preference,
    });
    showToast(t(`សូមស្វាគមន៍ដំណើរក្លាយជាម្តាយដ៏កក់ក្តៅ 🌸`, `Welcome to your pregnancy journey, Mama 🌸`));
  };

  // Resources CRUD for Content Management
  // NOTE: these only change the browser copy for now. Add or edit real
  // articles in the Supabase Table Editor.
  const addResource = (resData: Omit<PregnancyResource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResource: PregnancyResource = {
      ...resData,
      id: 'res_' + Date.now().toString(36),
      title: resData.titleKh || resData.titleEn,
      summary: resData.summaryKh || resData.summaryEn,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResources((prev) => [newResource, ...prev]);
    showToast(t('បានបញ្ចូលឯកសារចំណេះដឹងថ្មីដោយជោគជ័យ 🌿', 'New pregnancy resource added successfully 🌿'));
    return newResource;
  };

  const updateResource = (id: string, updates: Partial<PregnancyResource>) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...updates,
              title: updates.titleKh || updates.title || r.titleKh,
              summary: updates.summaryKh || updates.summary || r.summaryKh,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    showToast(t('បានកែសម្រួលឯកសាររួចរាល់ 🌿', 'Resource updated successfully 🌿'));
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    showToast(t('បានលុបឯកសារ។', 'Resource removed.'));
  };

  const resetDefaultResources = () => {
    setResources(INITIAL_PREGNANCY_RESOURCES);
    showToast(t('បានត្រឡប់ទៅបញ្ជីឯកសារដើមដែលផ្ទៀងផ្ទាត់ដោយ FlowErs។', 'Resources reset to verified catalog.'));
  };

  const getResourceById = (id: string) => {
    return resources.find((r) => r.id === id);
  };

  const markResourceAsRead = (id: string, options?: { showUndoToast?: boolean }) => {
    if (!readResourceIds.includes(id)) {
      setReadResourceIds((prev) => [...prev, id]);
      logEvent('resource_marked_read', id, currentWeek);
      if (user?.id) {
        supabase
          .from('user_read_resources')
          .insert({ user_id: user.id, resource_id: id })
          .then(({ error }) => {
            if (error) console.warn('Could not save read status to database', error.message);
          });
      }

      const undoAction = options?.showUndoToast
        ? {
            label: t('មិនទាន់អាន (Undo)', 'Undo'),
            onClick: () => {
              setReadResourceIds((prev) => prev.filter((rId) => rId !== id));
              logEvent('resource_marked_unread', id, currentWeek);
              if (user?.id) {
                supabase
                  .from('user_read_resources')
                  .delete()
                  .eq('user_id', user.id)
                  .eq('resource_id', id)
                  .then(({ error }) => {
                    if (error) console.warn('Could not delete read status', error.message);
                  });
              }
              showToast(t('បានដកចេញពីបញ្ជីអានរួច។', 'Marked as unread.'));
            },
          }
        : undefined;

      showToast(
        t('អ្នកបានអានអត្ថបទនេះរួចរាល់ហើយ 🌸', 'Article marked as read! Gentle progress, Mama 🌸'),
        undoAction
      );
    }
  };

  const toggleResourceRead = (id: string) => {
    if (readResourceIds.includes(id)) {
      setReadResourceIds((prev) => prev.filter((rId) => rId !== id));
      logEvent('resource_marked_unread', id, currentWeek);
      if (user?.id) {
        supabase
          .from('user_read_resources')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', id)
          .then(({ error }) => {
            if (error) console.warn('Could not delete read status from database', error.message);
          });
      }
      showToast(t('បានដកចេញពីបញ្ជីអានរួច។', 'Article unmarked.'));
    } else {
      setReadResourceIds((prev) => [...prev, id]);
      logEvent('resource_marked_read', id, currentWeek);
      if (user?.id) {
        supabase
          .from('user_read_resources')
          .insert({ user_id: user.id, resource_id: id })
          .then(({ error }) => {
            if (error) console.warn('Could not save read status to database', error.message);
          });
      }
      showToast(t('អ្នកបានអានអត្ថបទនេះរួចរាល់ហើយ 🌸', 'Article marked as read! Gentle progress, Mama 🌸'));
    }
  };

  const resetReadProgress = () => {
    setReadResourceIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY_READ_RESOURCES);
    } catch {}
    if (user?.id) {
      supabase
        .from('user_read_resources')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.warn('Could not reset read status from database', error.message);
        });
    }
    showToast(t('បានកំណត់ប្រវត្តិការអានឡើងវិញ។', 'Reading progress reset.'));
  };

  const isResourceRead = (id: string) => readResourceIds.includes(id);

  // Permanently deletes all personal data from database & local device
  const deleteMyData = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: t('មិនមានគណនីកំពុងចូលប្រើទេ។', 'No user logged in.') };
    }

    try {
      // 1. Delete rows in analytics_events for this user
      await supabase.from('analytics_events').delete().eq('user_id', user.id);

      // 2. Delete rows in user_read_resources
      await supabase.from('user_read_resources').delete().eq('user_id', user.id);

      // 3. Delete plan items and telegram links/codes
      await supabase.from('plan_items').delete().eq('user_id', user.id);
      await supabase.from('telegram_links').delete().eq('user_id', user.id);
      await supabase.from('link_codes').delete().eq('user_id', user.id);

      // 4. Delete user row in users table
      const { error: userError } = await supabase.from('users').delete().eq('id', user.id);
      if (userError) {
        console.warn('Could not delete profile from users table', userError.message);
      }

      // 4. Clear local storage
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_READ_RESOURCES);
        localStorage.removeItem(STORAGE_KEY_ANALYTICS);
      } catch {}

      // 5. Reset local state
      setUser(null);
      setReadResourceIds([]);
      setAnalyticsEvents([]);
      setCurrentWeek(9);
      setActiveTabState('home');

      // 6. Sign out of Supabase auth
      await supabase.auth.signOut();

      showToast(t('ទិន្នន័យទាំងអស់របស់អ្នកត្រូវបានលុបចេញដោយសុវត្ថិភាព 🌸', 'All your data has been safely deleted 🌸'));
      return { success: true };
    } catch (err: any) {
      console.error('Delete data failed:', err);
      return { success: false, error: err?.message || 'Delete data failed' };
    }
  };

  // Entitlement Rules & Evaluations
  const isUserPremium = !!user?.is_premium;

  const checkCanOpenSummary = (resource: ResourceSummaryItem): SummaryAccessResult => {
    return evaluateCanOpenSummary(resource, isUserPremium, todayOpenedSummaries);
  };

  const checkCanUsePlan = (): FeatureAccessResult => {
    return evaluateCanUsePlan(isUserPremium);
  };

  const checkCanUseReminders = (): FeatureAccessResult => {
    return evaluateCanUseReminders(isUserPremium);
  };

  const trackOpenedSummary = async (resource: ResourceSummaryItem) => {
    // Safety-critical resources are always 100% free and NEVER counted against quota
    if (resource.is_safety_critical) return;

    const todayStr = getCambodiaDateStr();
    setTodayOpenedSummaries((prev) => {
      // Re-opening the same summary the same day does not count again
      if (prev.includes(resource.id)) return prev;
      const next = [...prev, resource.id];

      // Save to localStorage
      try {
        localStorage.setItem('mae_daily_usage_' + todayStr, JSON.stringify(next));
      } catch {}

      // Save to Supabase daily_usage table if logged in
      if (user?.id) {
        supabase
          .from('daily_usage')
          .upsert({
            user_id: user.id,
            date: todayStr,
            summary_ids: next,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => {
            if (error) console.warn('Could not save daily usage to database', error.message);
          });
      }

      return next;
    });
  };

  const dailySummariesLimit = FREE_LIMITS.dailySummaries;
  const dailySummariesRemaining = isUserPremium || dailySummariesLimit <= 0
    ? Infinity
    : Math.max(0, dailySummariesLimit - todayOpenedSummaries.length);

  const value: AppContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUserPreferences,
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding,
    currentWeek,
    currentMonth,
    setCurrentWeek,
    monthlyMessage,
    focusTopics,
    monthlyMessagesList: MONTHLY_MOM_MESSAGES,
    resources,
    addResource,
    updateResource,
    deleteResource,
    resetDefaultResources,
    getResourceById,
    readResourceIds,
    markResourceAsRead,
    toggleResourceRead,
    isResourceRead,
    resetReadProgress,
    activeTab,
    setActiveTab,
    selectedResource,
    setSelectedResource,
    selectedTopic,
    setSelectedTopic,
    isContentEntryOpen,
    setIsContentEntryOpen,
    editingResource,
    setEditingResource,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    analyticsConsent,
    setAnalyticsConsent,
    analyticsEvents,
    logEvent,
    isAnalyticsOpen,
    setIsAnalyticsOpen,
    clearAnalytics,
    deleteMyData,
    toastMessage,
    toastAction,
    showToast,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeModalSource,
    isPremium: isUserPremium,
    canOpenSummary: checkCanOpenSummary,
    canUsePlan: checkCanUsePlan,
    canUseReminders: checkCanUseReminders,
    trackOpenedSummary,
    todayOpenedSummaries,
    dailySummariesLimit,
    dailySummariesRemaining,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};