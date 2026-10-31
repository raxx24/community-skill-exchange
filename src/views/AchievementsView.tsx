import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Flame,
  Clock,
  Target,
  ArrowRightLeft,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const AchievementsView: React.FC = () => {
  const { achievements, currentUser, goals, activities, requests } = useApp();

  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'In Progress'>('All');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const overallPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'Unlocked') return ach.unlocked;
    if (filter === 'In Progress') return !ach.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Milestone Recognition
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Community Badges & Achievements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Celebrate active participation, mentoring dedication, consistent learning streaks, and completed goals.
          </p>
        </div>
      </div>

      {/* Overview Progress Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Your Badge Progress
            </span>
            <h2 className="text-2xl font-black mt-1">
              {unlockedCount} of {totalCount} Badges Unlocked
            </h2>
            <p className="text-white/80 text-xs mt-1 max-w-lg">
              Achievements track quantifiable activity in SkillBridge (sessions logged, goals finished, streaks maintained).
            </p>
          </div>

          <div className="text-right">
            <span className="text-4xl font-black">{overallPercentage}%</span>
            <span className="text-xs text-white/80 block">Completed</span>
          </div>
        </div>

        {/* Big Progress bar */}
        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setFilter('All')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'All'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Badges ({totalCount})
        </button>

        <button
          onClick={() => setFilter('Unlocked')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'Unlocked'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unlocked ({unlockedCount})
        </button>

        <button
          onClick={() => setFilter('In Progress')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'In Progress'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Progress ({totalCount - unlockedCount})
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          const progressPct = Math.min(
            100,
            Math.round((ach.progress / ach.maxProgress) * 100)
          );

          return (
            <div
              key={ach.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-white border-amber-200 hover:border-amber-300 ring-1 ring-amber-500/10'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Icon & Status */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                      isUnlocked
                        ? 'bg-amber-100 border border-amber-200 text-amber-800'
                        : 'bg-slate-200 border border-slate-300 text-slate-400 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Locked
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{ach.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category: {ach.category}
                  </span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>
                    {ach.progress} / {ach.maxProgress}
                  </span>
                  <span className="font-bold text-slate-800">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {isUnlocked && ach.unlockedAt && (
                  <div className="text-[10px] text-slate-400 text-right pt-0.5">
                    Achieved {formatDate(ach.unlockedAt)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
