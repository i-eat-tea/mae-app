/**
 * ម៉ែ — by FlowErs
 * Profile Screen: "គណនី"
 *
 * Implements Section 13:
 * Minimal profile containing strictly:
 * - Name
 * - Pregnancy week OR due date
 * - Language (Khmer / English)
 * - Notification preference (Daily / Weekly / None)
 * - Logout
 */

import React, { useState } from 'react';
import { User, Bell, Globe, LogOut, Calendar, Heart, Trash2, ShieldCheck, AlertTriangle, X, Briefcase, Baby, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserLanguage, NotificationPreference, DueDateMethod } from '../types';
import { TelegramLink } from '../components/TelegramLink';
import { DueDateModal } from '../components/DueDate';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isPremium,
    setIsUpgradeModalOpen,
    logout,
    updateUserPreferences,
    currentWeek,
    setCurrentWeek,
    setIsAuthModalOpen,
    setAuthModalMode,
    analyticsConsent,
    setAnalyticsConsent,
    deleteMyData,
    t,
  } = useApp();

  const [editName, setEditName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-3xl mx-auto shadow-2xs">
          🌸
        </div>
        <h2 className="text-xl font-serif font-bold text-[#233125]">
          {t('ចូលប្រើដើម្បីតាមដានការវិវឌ្ឍន៍នៃការមានផ្ទៃពោះ', 'Sign in to Personalize Your Journey')}
        </h2>
        <p className="text-xs sm:text-sm text-[#5F6E60]">
          {t(
            'បង្កើតគណនីដើម្បីកត់ត្រាសប្ដាហ៍ពពោះ និងទទួលសារកក់ក្តៅពីម៉ែ។',
            'Save your pregnancy week and receive gentle words from mom.'
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-3 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-sm font-semibold shadow-xs transition-all"
        >
          {t('ចូលប្រើ ឬចុះឈ្មោះ', 'Sign In or Register')}
        </button>
      </div>
    );
  }

  const handleLanguageChange = (lang: UserLanguage) => {
    updateUserPreferences({ language: lang });
  };

  const handleReminderChange = (pref: NotificationPreference) => {
    updateUserPreferences({ notification_preference: pref });
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      updateUserPreferences({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMyData();
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDueDate = (data: {
    dueDate: string;
    method: DueDateMethod;
    calculatedWeek: number;
    lmpDate?: string;
  }) => {
    updateUserPreferences({
      due_date: data.dueDate,
      due_date_method: data.method,
      pregnancy_week: data.calculatedWeek,
      lmp_date: data.lmpDate,
    });
    setCurrentWeek(data.calculatedWeek);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#233125]">
          {t('គណនីរបស់អ្នក', 'My Profile')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6E60] mt-0.5">
          {t('ព័ត៌មានផ្ទាល់ខ្លួន និងការកំណត់ត្រាផ្សេងៗក្នុងកម្មវិធី «ម៉ែ»។', 'Manage your basic details and preferences.')}
        </p>
      </div>

      {/* 1. Name & Basic Info */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 text-[#88A04D] font-bold text-lg flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#88A04D] text-sm text-[#233125] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-3 py-1.5 rounded-xl bg-[#88A04D] text-white text-xs font-semibold"
                  >
                    {t('រក្សាទុក', 'Save')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#233125]">
                    {user.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name);
                      setIsEditing(true);
                    }}
                    className="text-xs text-[#88A04D] hover:underline"
                  >
                    ({t('កែប្រែ', 'edit')})
                  </button>
                </div>
              )}
              <p className="text-xs text-[#5F6E60]">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 2. Pregnancy Week / Due Date */}
        <div className="pt-4 border-t border-[#E5EADF] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#233125]">
              {t('សប្ដាហ៍នៃការពពោះ និងថ្ងៃសម្រាល', 'Pregnancy Week & Due Date')}
            </label>
            <button
              type="button"
              onClick={() => setIsDueDateModalOpen(true)}
              className="text-xs font-semibold text-[#88A04D] hover:text-[#5C7034] underline underline-offset-2 inline-flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('កែប្រែថ្ងៃសម្រាល (Calculator)', 'Change due date')}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={currentWeek}
              onChange={(e) => {
                const w = parseInt(e.target.value, 10);
                setCurrentWeek(w);
                updateUserPreferences({ pregnancy_week: w });
              }}
              className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5EADF] text-xs sm:text-sm text-[#233125] font-semibold focus:border-[#88A04D]"
            >
              {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {t(`សប្ដាហ៍ទី ${w} (ខែទី ${Math.min(9, Math.ceil(w / 4.4))})`, `Week ${w}`)}
                </option>
              ))}
            </select>

            {user.due_date && (
              <span className="text-xs text-[#5F6E60] bg-[#FAF9F5] px-3 py-2 rounded-xl border border-[#E5EADF]">
                {t('ថ្ងៃសម្រាល៖', 'Due date:')}{' '}
                <strong className="text-[#233125]">{user.due_date}</strong>
                {user.due_date_method && (
                  <span className="text-[10px] text-[#88A04D] ml-1">
                    ({user.due_date_method})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* 2b. Occupation & First Pregnancy (if recorded) */}
        {(user.occupation || user.is_first_pregnancy !== undefined) && (
          <div className="pt-3 border-t border-[#E5EADF] flex flex-wrap gap-2 text-xs">
            {user.is_first_pregnancy !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-[#5F6E60]">
                <Baby className="w-3.5 h-3.5 text-[#88A04D]" />
                <span>
                  {user.is_first_pregnancy
                    ? t('ពពោះលើកដំបូង', 'First pregnancy')
                    : t(`ធ្លាប់មានកូន (${user.children_count || 1})`, `Has children (${user.children_count || 1})`)}
                </span>
              </span>
            )}

            {user.occupation && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-[#5F6E60]">
                <Briefcase className="w-3.5 h-3.5 text-[#88A04D]" />
                <span>{user.occupation}</span>
              </span>
            )}
          </div>
        )}
      </section>

      {/* 2. Membership & Plan Status */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7034]">
            <Sparkles className="w-4 h-4 text-[#88A04D]" />
            <span>{t('កម្រិតនៃការប្រើប្រាស់ (Plan Status)', 'Plan Status')}</span>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 ${
              isPremium
                ? 'bg-[#EBF1E4] text-[#5C7034] border border-[#88A04D]/30'
                : 'bg-[#FAF9F5] text-[#5F6E60] border border-[#E5EADF]'
            }`}
          >
            {isPremium ? (
              <>
                <span>🌸</span>
                <span>{t('គណនីពិសេស (Premium · My Plan)', 'Premium (My Plan)')}</span>
              </>
            ) : (
              <>
                <span>🌱</span>
                <span>{t('គណនីឥតគិតថ្លៃ (Free Plan)', 'Free Plan')}</span>
              </>
            )}
          </span>
        </div>

        <div className="text-xs text-[#5F6E60] leading-relaxed">
          {isPremium ? (
            <p className="text-[#233125]">
              {t(
                'អ្នកមានសិទ្ធិប្រើប្រាស់ពេញលេញលើមុខងារ «គម្រោងរបស់ខ្ញុំ» (My Plan), សាររំលឹកតាម Telegram និងការនាំចេញប្រតិទិន។',
                'You have full access to My Plan, Telegram morning alerts, and Calendar export.'
              )}
            </p>
          ) : (
            <p>
              {t(
                'អ្នកអាចអានអត្ថបទសុខភាព និងស្តាប់សារសំឡេងទាំងអស់ដោយឥតគិតថ្លៃ។ សម្រាប់អ្នកចង់សាកល្បងមុខងារ My Plan អាចស្នើសុំដើម្បីឱ្យក្រុមការងារបើកជូនដោយផ្ទាល់។',
                'All educational resources and audio messages are 100% free. You can request free beta access to My Plan.'
              )}
            </p>
          )}
        </div>

        {!isPremium && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs font-semibold shadow-2xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('ដំឡើងគម្រោង / ភ្ជាប់ Telegram 🌸', 'Purchase / Upgrade Plan 🌸')}</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Language Selection (Khmer-First) */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7034]">
          <Globe className="w-4 h-4 text-[#88A04D]" />
          <span>{t('ភាសាប្រើប្រាស់', 'Language')}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLanguageChange('km')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              user.language === 'km'
                ? 'bg-[#EBF1E4] border-[#88A04D] font-bold text-[#233125] shadow-2xs'
                : 'bg-[#FAF9F5] border-[#E5EADF] text-[#5F6E60] hover:text-[#233125]'
            }`}
          >
            <div className="text-sm font-semibold">ភាសាខ្មែរ (Khmer)</div>
            <div className="text-[11px] text-[#5C7034] mt-0.5">ភាសាដំបូងគេ (Default)</div>
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              user.language === 'en'
                ? 'bg-[#EBF1E4] border-[#88A04D] font-bold text-[#233125] shadow-2xs'
                : 'bg-[#FAF9F5] border-[#E5EADF] text-[#5F6E60] hover:text-[#233125]'
            }`}
          >
            <div className="text-sm font-semibold">English</div>
            <div className="text-[11px] text-[#5F6E60] mt-0.5">Secondary language</div>
          </button>
        </div>
      </section>

      {/* 4. Notification Preference (Validation Options: Daily / Weekly / None) */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7034]">
          <Bell className="w-4 h-4 text-[#88A04D]" />
          <span>{t('ការទទួលការរំលឹកពីម៉ែ', 'Reminder Frequency')}</span>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'weekly' as const,
              labelKh: 'រៀងរាល់សប្ដាហ៍ (Weekly)',
              descKh: 'ទទួលសាររំលឹកមួយដងក្នុងមួយសប្ដាហ៍',
            },
            {
              id: 'daily' as const,
              labelKh: 'រៀងរាល់ថ្ងៃ (Daily)',
              descKh: 'ទទួលការរំលឹកញ៉ាំទឹក សម្រាក និងថែរក្សាខ្លួនប្រចាំថ្ងៃ',
            },
            {
              id: 'none' as const,
              labelKh: 'មិនទទួល (None)',
              descKh: 'ស្វែងរកព័ត៌មានដែលអ្នកចង់ដឹងនៅទីនេះដោយមិនទទួលសាររំលឹកពីម៉ែ',
            },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                user.notification_preference === item.id
                  ? 'bg-[#FAF9F5] border-[#88A04D] shadow-2xs'
                  : 'bg-white border-[#E5EADF] hover:bg-[#FAF9F5]/50'
              }`}
            >
              <input
                type="radio"
                name="notification_preference"
                checked={user.notification_preference === item.id}
                onChange={() => handleReminderChange(item.id)}
                className="mt-1 accent-[#88A04D]"
              />
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#233125]">
                  {item.labelKh}
                </div>
                <div className="text-[11px] text-[#5F6E60] mt-0.5">
                  {item.descKh}
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* 5. Telegram Daily Reminders Integration */}
      <section>
        <TelegramLink />
      </section>

      {/* 6. Privacy & Research Data Consent */}
      <section className="rounded-3xl bg-white border border-[#E5EADF] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7034]">
            <ShieldCheck className="w-4 h-4 text-[#88A04D]" />
            <span>{t('ការស្រាវជ្រាវ និងភាពឯកជន', 'Research & Privacy')}</span>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              analyticsConsent === 'granted'
                ? 'bg-[#EBF1E4] text-[#5C7034]'
                : analyticsConsent === 'denied'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {analyticsConsent === 'granted'
              ? t('បានយល់ព្រម', 'Granted')
              : analyticsConsent === 'denied'
              ? t('មិនយល់ព្រម', 'Declined')
              : t('មិនទាន់កំណត់', 'Unset')}
          </span>
        </div>

        <p className="text-xs text-[#5F6E60] leading-relaxed">
          {t(
            'ទិន្នន័យស្រាវជ្រាវត្រូវបានប្រើសម្រាប់តែកែលម្អកម្មវិធីប៉ុណ្ណោះ។ ការភ្ជាប់ Telegram គឺស្រេចចិត្ត ដោយប្រព័ន្ធរក្សាទុកតែ Telegram Chat ID (គ្មានការរក្សាទុកលេខទូរស័ព្ទឡើយ) ហើយអ្នកអាចផ្តាច់បានគ្រប់ពេល។',
            'Research logs are used solely to improve the app. Telegram reminders are optional: only your chat ID is stored (no phone numbers), and you can switch it off anytime.'
          )}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setAnalyticsConsent(analyticsConsent === 'granted' ? 'denied' : 'granted')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              analyticsConsent === 'granted'
                ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                : 'border-[#88A04D] text-[#5C7034] bg-[#EBF1E4] hover:bg-[#EBF1E4]/80'
            }`}
          >
            {analyticsConsent === 'granted'
              ? t('ដកការយល់ព្រម (Revoke Consent)', 'Revoke Consent')
              : t('ផ្តល់ការយល់ព្រម (Grant Consent)', 'Grant Consent')}
          </button>
        </div>
      </section>

      {/* 6. Account Actions */}
      <section className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#E5EADF] text-[#5F6E60] hover:text-[#233125] hover:bg-[#FAF9F5] text-xs sm:text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('ចាកចេញពីគណនី (Log Out)', 'Log Out')}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs sm:text-sm font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('លុបទិន្នន័យរបស់ខ្ញុំ (Delete My Data)', 'Delete My Data')}</span>
        </button>
      </section>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FAF9F5] border-t sm:border border-[#E5EADF] shadow-2xl p-5 sm:p-6 space-y-4 animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#233125]">
                  {t('លុបទិន្នន័យរបស់អ្នក?', 'Delete Your Data?')}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6E60] leading-relaxed">
              {t(
                'តើអ្នកពិតជាចង់លុបទិន្នន័យទាំងអស់របស់អ្នកមែនទេ? សកម្មភាពនេះនឹងលុបប្រវត្តិអត្ថបទដែលបានអាន ប្រវត្តិស្រាវជ្រាវ និងព័ត៌មានគណនីរបស់អ្នកចេញពីប្រព័ន្ធភ្លាមៗ ហើយមិនអាចត្រឡប់វិញបានឡើយ។',
                'Are you sure you want to permanently delete all your data? This will immediately remove your reading progress, research activity logs, and user profile. This action cannot be undone.'
              )}
            </p>

            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-[11px] text-red-800 leading-relaxed">
              {t(
                'ចំណាំ៖ គណនីចូលប្រព័ន្ធ (Auth login) នឹងត្រូវចាកចេញភ្លាមៗ។ ដើម្បីលុបគណនីចូលប្រព័ន្ធចេញជាស្ថាពរពី Supabase សូមទាក់ទងមកក្រុមការងារ [CONTACT]។',
                'Note: You will be logged out immediately. To permanently remove your auth login record from Supabase, please reach out to [CONTACT].'
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="min-h-[44px] w-full py-2.5 px-4 rounded-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                {isDeleting
                  ? t('កំពុងលុបទិន្នន័យ...', 'Deleting data...')
                  : t('បាទ/ចាស លុបទិន្នន័យទាំងអស់', 'Yes, Delete All My Data')}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="min-h-[44px] w-full py-2.5 px-4 rounded-full bg-white border border-[#E5EADF] text-[#5F6E60] hover:text-[#233125] text-xs sm:text-sm font-medium transition-colors"
              >
                {t('បោះបង់ (Cancel)', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Due Date Calculator Modal */}
      <DueDateModal
        isOpen={isDueDateModalOpen}
        onClose={() => setIsDueDateModalOpen(false)}
        onSave={handleSaveDueDate}
        initialDueDate={user.due_date}
        initialMethod={user.due_date_method || 'doctor'}
      />
    </div>
  );
};
