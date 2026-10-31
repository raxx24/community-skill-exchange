import React from 'react';
import { useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/ToastContainer';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DiscoverView } from './views/DiscoverView';
import { MatchesView } from './views/MatchesView';
import { MySkillsView } from './views/MySkillsView';
import { GoalsView } from './views/GoalsView';
import { ActivityTrackerView } from './views/ActivityTrackerView';
import { PartnershipsView } from './views/PartnershipsView';
import { AchievementsView } from './views/AchievementsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileView } from './views/ProfileView';

export const App: React.FC = () => {
  const { isAuthenticated, currentUser, activeTab } = useApp();

  // If not logged in, render the professional Login & Registration Portal
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900">
        <LoginView />
        <ToastContainer />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'discover':
        return <DiscoverView />;
      case 'matches':
        return <MatchesView />;
      case 'my-skills':
        return <MySkillsView />;
      case 'goals':
        return <GoalsView />;
      case 'activity':
        return <ActivityTrackerView />;
      case 'partnerships':
        return <PartnershipsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Persistent Navigation */}
      <Navigation />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🤝</span>
            <span className="font-bold text-slate-700">SkillBridge Community Platform</span>
            <span>• Peer-to-Peer Collaborative Learning Network</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              ● Secure Session Active
            </span>
            <span>Internship Capstone Project</span>
          </div>
        </div>
      </footer>

      {/* Notification Toasts */}
      <ToastContainer />
    </div>
  );
};
