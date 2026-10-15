/**
 * ម៉ែ — by FlowErs
 * Top Navigation Bar
 *
 * Product Name: ម៉ែ
 * Brand reference: ម៉ែ — by FlowErs
 * Khmer-first navigation: ទំព័រដើម, ដំណើរ, ស្វែងយល់, គណនី
 */

import React from 'react';
import { Database, Activity, LogIn, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsContentEntryOpen,
    setEditingResource,
    setIsAnalyticsOpen,
    language,
    toggleLanguage,
    currentWeek,
    t,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5EADF] pt-[env(safe-area-inset-top)]">
      <div className="max-w-[1140px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Wordmark: ម៉ែ — by FlowErs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left min-h-[44px] min-w-[44px] py-1"
            aria-label="ម៉ែ — by FlowErs Home"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-base sm:text-lg shadow-2xs group-hover:scale-105 transition-transform">
              🌸
            </span>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#233125] tracking-tight group-hover:text-[#5C7034] transition-colors leading-none">
                ម៉ែ
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#5F6E60] font-medium tracking-wide">
                by FlowErs
              </span>
            </div>
          </button>

          {/* Mobile week indicator when authenticated */}
          {isAuthenticated && (
            <span className="inline-flex md:hidden items-center px-2 py-0.5 rounded-full bg-[#F0F4E8] text-[#5C7034] text-[11px] font-semibold border border-[#88A04D]/30">
              {t(`ស. ${currentWeek}`, `W${currentWeek}`)}
            </span>
          )}
        </div>

        {/* 4 Clean Navigation Links (Khmer First) - Hidden on phones */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5F6E60]">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`transition-colors py-1 ${
              activeTab === 'home'
                ? 'text-[#233125] font-semibold border-b-2 border-[#88A04D]'
                : 'hover:text-[#233125]'
            }`}
          >
            {t('ទំព័រដើម', 'Home')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`transition-colors py-1 ${
              activeTab === 'journey'
                ? 'text-[#233125] font-semibold border-b-2 border-[#88A04D]'
                : 'hover:text-[#233125]'
            }`}
          >
            {t('ដំណើររបស់កូន', 'My Journey')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plan')}
            className={`transition-colors py-1 ${
              activeTab === 'plan'
                ? 'text-[#233125] font-semibold border-b-2 border-[#88A04D]'
                : 'hover:text-[#233125]'
            }`}
          >
            {t('គម្រោងរបស់ខ្ញុំ', 'My Plan')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`transition-colors py-1 ${
              activeTab === 'explore'
                ? 'text-[#233125] font-semibold border-b-2 border-[#88A04D]'
                : 'hover:text-[#233125]'
            }`}
          >
            {t('ស្វែងយល់', 'Explore')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`transition-colors py-1 ${
              activeTab === 'profile'
                ? 'text-[#233125] font-semibold border-b-2 border-[#88A04D]'
                : 'hover:text-[#233125]'
            }`}
          >
            {t('គណនី', 'Profile')}
          </button>
        </nav>

        {/* Right Zone: Language Toggle + Content Entry + Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Switcher - 44px min tap target */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1 min-h-[44px] px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#5F6E60] hover:text-[#233125] bg-white border border-[#E5EADF] hover:border-[#88A04D]/40 transition-colors"
            title="ប្តូរភាសា / Switch Language"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#88A04D]" />
            <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* Quick Team Content Entry */}
          <button
            type="button"
            onClick={() => {
              setEditingResource(null);
              setIsContentEntryOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-full text-xs font-medium text-[#5F6E60] bg-white border border-[#E5EADF] hover:text-[#233125] hover:border-[#88A04D]/40 transition-colors"
            title="បញ្ចូលឯកសារចំណេះដឹង (Team CMS)"
          >
            <Database className="w-3.5 h-3.5 text-[#88A04D]" />
            <span>{t('+ បញ្ចូលឯកសារ', '+ Add Resource')}</span>
          </button>

          {/* Quick MVP Telemetry Inspector */}
          <button
            type="button"
            onClick={() => setIsAnalyticsOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#5F6E60] hover:text-[#233125] hover:bg-white border border-transparent hover:border-[#E5EADF] transition-colors"
            title={t('ទិន្នន័យស្រាវជ្រាវ MVP', 'MVP Research Telemetry')}
            aria-label="MVP Telemetry"
          >
            <Activity className="w-4 h-4 text-[#88A04D]" />
          </button>

          {/* Auth State Button */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 min-h-[44px] pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-white border border-[#E5EADF] hover:border-[#88A04D]/40 text-xs font-medium text-[#233125] transition-colors"
              aria-label="Open profile"
            >
              <span className="w-7 h-7 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </span>
              <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                {user?.name}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1 min-h-[44px] px-3.5 sm:px-4 py-1.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('ចូលប្រើ', 'Log In')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
