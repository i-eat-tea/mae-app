/**
 * FlowErs - Pregnancy Companion MVP Frontend
 * Main Application Shell & View Orchestration
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PlanProvider } from './context/PlanContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { PlanScreen } from './screens/PlanScreen';
import { ResourcesScreen } from './screens/ResourcesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LandingScreen } from './screens/LandingScreen';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ResourceModal } from './components/ResourceModal';
import { TopicModal } from './components/TopicModal';
import { ContentEntryModal } from './components/ContentEntryModal';
import { AnalyticsDashboardModal } from './components/AnalyticsDashboardModal';
import { ConsentBanner } from './components/ConsentBanner';
import { UpgradeModal } from './components/UpgradeModal';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    selectedResource,
    setSelectedResource,
    selectedTopic,
    setSelectedTopic,
    isContentEntryOpen,
    setIsContentEntryOpen,
    editingResource,
    toastMessage,
    toastAction,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeModalSource,
  } = useApp();

  // Screen selection
  const renderCurrentScreen = () => {
    // If not authenticated and activeTab is 'home', show LandingScreen with easy access to Demo Mama & Sign In
    if (!isAuthenticated && activeTab === 'home') {
      return <LandingScreen />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'journey':
        return <JourneyScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'explore':
        return <ResourcesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF9F5] text-[#233125] overflow-x-hidden">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Floating Toast Notification for Feedback & Simulating Reminders */}
      {toastMessage && (
        <aside
          aria-label="Notification alert"
          className="fixed top-[max(1.25rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[70] max-w-sm sm:max-w-md w-[92%] px-4 py-3 rounded-2xl bg-[#233125] text-white text-xs sm:text-sm font-medium shadow-xl border border-[#88A04D]/40 flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span>🌸</span>
            <span className="truncate">{toastMessage}</span>
          </div>

          {toastAction && (
            <button
              type="button"
              onClick={toastAction.onClick}
              className="px-3 py-1.5 rounded-xl bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs font-bold transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
            >
              {toastAction.label}
            </button>
          )}
        </aside>
      )}

      {/* Main Content: full width on mobile with safe horizontal padding, centered on desktop */}
      <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-28 md:pb-12">
        {renderCurrentScreen()}
      </main>

      {/* Desktop Quiet Footer */}
      <footer className="hidden md:block py-6 border-t border-[#E5EADF] text-xs text-[#5F6E60] bg-[#FAF9F5]">
        <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#233125]">ម៉ែ</span>
            <span className="text-[#5F6E60]">by FlowErs</span>
            <span>·</span>
            <span>នៅក្បែរម៉ាក់ៗ សម្រាប់ការមានពពោះលើកដំបូង</span>
          </div>
          <div className="text-[11px] text-[#5F6E60]/80">
            ចំណេះដឹងអំពីការមានផ្ទៃពោះ ពីប្រភពដែលអាចទុកចិត្តបាន (NMCHC), WHO, UNICEF & RHAC។ ព័ត៌មានសម្រាប់ជួយឲ្យម៉ាក់យល់ដឹង និងត្រៀមខ្លួន មិនមែនជាការធ្វើរោគវិនិច្ឆ័យឡើយ។
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav />

      {/* Research & Data Privacy Consent Banner */}
      <ConsentBanner />

      {/* Global Interactive Modals */}
      <AuthModal />
      <OnboardingModal />
      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
      <ContentEntryModal
        isOpen={isContentEntryOpen}
        onClose={() => setIsContentEntryOpen(false)}
        resourceToEdit={editingResource}
      />
      <AnalyticsDashboardModal />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        source={upgradeModalSource}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PlanProvider>
        <AppContent />
      </PlanProvider>
    </AppProvider>
  );
}
