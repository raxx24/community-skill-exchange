import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Compass,
  ArrowRightLeft,
  GraduationCap,
  Target,
  Clock,
  Users,
  Award,
  BarChart3,
  User,
  Menu,
  X,
  Flame,
  Plus,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ActivityModal } from './ActivityModal';
import { GoalModal } from './GoalModal';

export const Navigation: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    requests,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  if (!currentUser) return null;

  // Count pending incoming requests
  const pendingRequestsCount = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  ).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'discover',
      label: 'Discover & Search',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'matches',
      label: 'Skill Matches',
      icon: <ArrowRightLeft className="w-4 h-4" />,
    },
    {
      id: 'my-skills',
      label: 'My Skills',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'goals',
      label: 'Learning Goals',
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'partnerships',
      label: 'Exchange Requests',
      icon: <Users className="w-4 h-4" />,
      badge: pendingRequestsCount,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Export',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">🤝</span>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">
                  SkillBridge
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
                  Community Skill Exchange
                </span>
              </div>
            </button>
          </div>

          {/* Quick Header Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              title={`${currentUser.streakDays}-day active learning streak`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{currentUser.streakDays} Day Streak</span>
            </div>

            {/* Quick Action: Log Session */}
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Session
            </button>

            {/* User Profile & Sign Out Dropdown */}
            <div className="relative pl-2 border-l border-slate-200">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 ring-2 ring-indigo-500/20"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => handleTabClick('profile')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Edit Profile & Availability
                  </button>

                  <button
                    onClick={() => handleTabClick('my-skills')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-semibold flex items-center gap-2"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Manage My Skills
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row on Large Screens */}
        <div className="hidden lg:block bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-indigo-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl py-4 z-10 overflow-y-auto">
            <div className="px-5 flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🤝</span>
                <span className="text-base font-extrabold text-indigo-950">
                  SkillBridge
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current user card in mobile menu */}
            <div className="p-4 mx-4 my-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-indigo-200"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.role}</div>
                <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {currentUser.streakDays} day streak
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-indigo-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="mt-auto px-4 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsActivityModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Log Learning Activity
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </>
  );
};
