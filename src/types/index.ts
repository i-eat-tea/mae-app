/**
 * ម៉ែ — by FlowErs
 * Core Data Models and Types
 * Cambodia-first, Khmer-first pregnancy companion for first-time mothers.
 */

export type UserLanguage = 'km' | 'en';

export type NotificationPreference = 'daily' | 'weekly' | 'none';

export type DueDateMethod = 'doctor' | 'lmp' | 'conception';

export interface User {
  id: string;
  name: string;
  email: string;
  language: UserLanguage;
  pregnancy_week: number;
  due_date?: string;
  due_date_method?: DueDateMethod;
  lmp_date?: string;
  occupation?: string;
  is_first_pregnancy?: boolean;
  children_count?: number;
  notification_preference: NotificationPreference;
  is_premium?: boolean;
  tier?: 'free' | 'premium';
  premium_until?: string;
  created_at: string;
}

export type ResourceCategory = 
  | 'អាហារូបត្ថម្ភ (Nutrition)'
  | 'ការពិនិត្យសុខភាព (Checkups)'
  | 'ការថែទាំរាងកាយនិងសុខភាពផ្លូវចិត្ត (Wellbeing)'
  | 'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)'
  | 'ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)';

export type PregnancyStage = 
  | 'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)'
  | 'ត្រីមាសទី ២ (សប្ដាហ៍ ១៣-២៧)'
  | 'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)'
  | 'គ្រប់ដំណាក់កាលនៃការពពោះ';

export type ResourceStatus = 'Draft' | 'Published' | 'Archived';

/**
 * Reusable Pregnancy Resource Content Model
 * Conforming strictly to Section 8 of the FlowErs Curated Resource System.
 */
export interface PregnancyResource {
  id: string;
  titleKh: string;
  titleEn: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  pregnancyStage: string;
  pregnancyWeeks: number[];
  summaryKh: string;
  summaryEn: string;
  summaryPurpose?: string;
  weeklyFocus?: string;
  keyTakeawayKh?: string;
  keyTakeawayEn?: string;
  importantNoteKh?: string;
  status: ResourceStatus;
  planSuggestions?: PlanSuggestion[];
  is_safety_critical?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Audio additions (Supabase Storage reference e.g. Psi_audio/1.mp3 & transcript)
  audioUrl?: string;
  audioTranscriptKh?: string;
  audioTranscriptEn?: string;
  audioDuration?: string;

  // Convenience aliases for flexible display
  title?: string;
  summary?: string;
}

export interface PlanSuggestion {
  id: string;
  text_kh: string;
  text_en: string;
}

export interface PlanItem {
  id: string;
  user_id: string;
  text_kh: string;
  text_en: string;
  source_type: 'resource' | 'voice_message';
  source_id: string;
  start_date: string;
  end_date: string;
  reminder_time?: string;
  done: boolean;
  created_at?: string;
}

export interface TelegramLink {
  user_id: string;
  chat_id: number;
  created_at: string;
}

export interface LinkCode {
  code: string;
  user_id: string;
  expires_at: string;
  created_at?: string;
}

export type TopicCategoryIcon = 'nutrition' | 'checkup' | 'daily' | 'preparation';

export interface FocusTopic {
  id: string;
  titleKh: string;
  titleEn: string;
  category: string;
  iconType: TopicCategoryIcon;
  summaryKh: string;
  summaryEn: string;
  resourceIds: string[];
  suggestedQuestionsKh?: string[];
  suggestedQuestionsEn?: string[];
}

export interface BabySize {
  week: number;
  fruitKh: string;
  fruitEn: string;
  sizeCm: number;
  emoji?: string;
}

export interface FlowerStage {
  phaseNameKh?: string;
  phaseNameEn?: string;
  descriptionKh?: string;
  descriptionEn?: string;
  percent: number;
  bloomIcon: 'seed' | 'sprout' | 'bud' | 'unfolding' | 'bloom' | 'full_blossom';
  phaseName?: string;
  description?: string;
}

export interface WeeklyTopic {
  id: string;
  title: string;
  category: string;
  iconType: TopicCategoryIcon;
  summary: string;
  resourceIds: string[];
  suggestedQuestions?: string[];
}

export interface WeeklyGuidance {
  id: string;
  pregnancyWeek: number;
  trimester: string;
  flowerStage: FlowerStage;
  title: string;
  greeting: string;
  introduction: string;
  audioScript: string;
  audioDuration: string;
  audioUrl?: string;
  topics: WeeklyTopic[];
  reminderNote?: string;
  createdAt: string;
}

/**
 * Monthly Maternal Voice Message: "ម៉ែមានរឿងចង់ប្រាប់" (A Message for Mom)
 * Emotional, gentle, warm mother-to-daughter guidance.
 */
export interface MonthlyMessage {
  id: string;
  month: number;
  stageWeeks: string; // e.g. "សប្ដាហ៍ទី ៩ - ១២"
  titleKh: string;   // e.g. "ម៉ែមានរឿងចង់ប្រាប់ 🌸"
  titleEn: string;   // "A Message for Mom"
  audioScriptKh: string; // "ម៉ែមានរឿងចង់ប្រាប់អ្នកបន្តិច..."
  audioScriptEn: string;
  audioDuration: string;
  audioUrl?: string;
  letterKh?: string;
  letterEn?: string;
  flowerStage: FlowerStage;
  reminderKh: string;
  reminderEn: string;
  planSuggestions?: PlanSuggestion[];
}

/**
 * Stage Focus Guidance containing the small focus topics for the current week/stage
 */
export interface StageGuidance {
  id: string;
  pregnancyWeek: number;
  month: number;
  trimesterKh: string;
  trimesterEn: string;
  monthlyMessage: MonthlyMessage;
  topics: FocusTopic[];
}

export type AnalyticsEventType =
  | 'account_created'
  | 'signup_completed'
  | 'login_completed'
  | 'onboarding_completed'
  | 'journey_opened'
  | 'pregnancy_week_selected'
  | 'week_viewed'
  | 'monthly_message_played'
  | 'monthly_message_completed'
  | 'weekly_guidance_played'
  | 'weekly_guidance_completed'
  | 'explore_opened'
  | 'search_performed'
  | 'topic_opened'
  | 'resource_opened'
  | 'resource_marked_read'
  | 'resource_marked_unread'
  | 'resource_read_completed'
  | 'original_source_clicked'
  | 'notification_preference_selected'
  | 'profile_updated'
  | 'feedback_submitted'
  | 'plan_sheet_opened'
  | 'plan_item_added'
  | 'plan_item_completed'
  | 'plan_item_deleted'
  | 'telegram_linked'
  | 'telegram_unlinked'
  | 'onboarding_question_answered'
  | 'due_date_updated'
  | 'paywall_shown'
  | 'upgrade_interest'
  | 'calendar_exported'
  | 'logout_completed';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventName: AnalyticsEventType;
  contentId?: string;
  pregnancyWeek?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
