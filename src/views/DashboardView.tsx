import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Target,
  Clock,
  ArrowRightLeft,
  Flame,
  Award,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { computeMatches } from '../utils/matchingAlgorithm';
import { formatDate, formatDuration, getCategoryBadgeClass } from '../utils/formatters';
import { UserProfileModal } from '../components/UserProfileModal';
import { ActivityModal } from '../components/ActivityModal';
import { GoalModal } from '../components/GoalModal';
import { RequestPartnershipModal } from '../components/RequestPartnershipModal';
import { UserProfile } from '../types';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    goals,
    activities,
    requests,
    achievements,
    setActiveTab,
    toggleMilestone,
  } = useApp();

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [exchangeUser, setExchangeUser] = useState<UserProfile | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  if (!currentUser) return null;

  // Compute smart matches for currentUser
  const matches = computeMatches(currentUser, allUsers);
  const topMutualMatches = matches.filter((m) => m.matchType === 'mutual').slice(0, 2);
  const otherTopMatches = matches.filter((m) => m.matchType !== 'mutual').slice(0, 2);

  // Calculations
  const userGoals = goals.filter((g) => g.userId === currentUser.id);
  const activeGoals = userGoals.filter((g) => g.status !== 'Completed');
  const completedGoals = userGoals.filter((g) => g.status === 'Completed');

  const userActivities = activities.filter((a) => a.userId === currentUser.id);
  const totalMinutes = userActivities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const teachingMinutes = userActivities
    .filter((a) => a.isTeaching)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const teachingHours = (teachingMinutes / 60).toFixed(1);

  const pendingRequests = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const handleOpenUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  const handleOpenExchange = (user: UserProfile) => {
    setExchangeUser(user);
    setIsExchangeModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Community Skill Exchange Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              You are currently offering{' '}
              <span className="text-white font-bold">{currentUser.teachingSkills.length} skills</span> and
              focusing on <span className="text-white font-bold">{currentUser.learningSkills.length} learning goals</span>.
              Ready for your next collaborative knowledge swap?
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Session
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-300" />
              View Matches ({matches.length})
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak & Consistency */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{currentUser.streakDays} Days</div>
            <div className="text-xs text-slate-500 font-medium">Learning Streak</div>
          </div>
        </div>

        {/* Logged Hours */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalHours} hrs</div>
            <div className="text-xs text-slate-500 font-medium">
              Total Logged ({teachingHours}h taught)
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {activeGoals.length}{' '}
              <span className="text-xs font-normal text-slate-400">/ {userGoals.length}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">Active Learning Goals</div>
          </div>
        </div>

        {/* Community Standing & Badges */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {unlockedAchievements.length}{' '}
              <span className="text-xs font-normal text-slate-400">/ {achievements.length}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">Achievements Unlocked</div>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols wide): Matches & Active Goals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mutual Skill Exchange Highlight */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Recommended Skill Exchanges
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-affinity peers whose teaching matches your goals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('matches')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                All Matches ({matches.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 divide-y divide-slate-100">
              {topMutualMatches.length > 0 ? (
                topMutualMatches.map((m) => (
                  <div
                    key={m.partner.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={m.partner.avatar}
                        alt={m.partner.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenUser(m.partner)}
                            className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
                          >
                            {m.partner.name}
                          </button>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            Mutual Swap • {m.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{m.partner.headline}</p>
                        <p className="text-xs text-slate-700 bg-emerald-50/70 border border-emerald-100 p-2 rounded-lg mt-2">
                          💡 <span className="font-semibold text-emerald-900">Exchange synergy:</span> {m.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenExchange(m.partner)}
                        className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Propose Swap
                      </button>
                      <button
                        onClick={() => handleOpenUser(m.partner)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Add more learning goals or teaching skills to unlock tailored mutual matches!
                </div>
              )}
            </div>
          </div>

          {/* Active Learning Goals with Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    In-Progress Goals & Milestones
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track your target completion dates and milestone progress
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Goal
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  View All ({userGoals.length})
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => {
                  const catClass = getCategoryBadgeClass(goal.category);
                  const completedMilestones = goal.milestones.filter((m) => m.completed).length;

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-purple-200 bg-slate-50/50 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {goal.title}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${catClass.bg} ${catClass.text} ${catClass.border}`}
                            >
                              {goal.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due {formatDate(goal.targetDate)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">
                            {completedMilestones} of {goal.milestones.length} checkpoints
                          </span>
                          <span className="text-purple-700 font-bold">{goal.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Milestones Checklist */}
                      <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                        {goal.milestones.map((milestone) => (
                          <label
                            key={milestone.id}
                            className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none group"
                          >
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={() => toggleMilestone(goal.id, milestone.id)}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                            />
                            <span
                              className={`transition-all ${
                                milestone.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-700'
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <p>All your goals are completed! Create a new one to continue growing.</p>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                  >
                    Add Learning Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Skills Snapshot & Recent Activity */}
        <div className="space-y-8">
          {/* Skills Offered vs Seeking Quick Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                My Skill Portfolio
              </h3>
              <button
                onClick={() => setActiveTab('my-skills')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Manage Skills
              </button>
            </div>

            {/* Teaching Skills */}
            <div>
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                <span>Teaching ({currentUser.teachingSkills.length})</span>
                <span className="text-[10px] text-emerald-600 font-bold">Can share</span>
              </div>
              <div className="space-y-2">
                {currentUser.teachingSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-indigo-50/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.proficiency} • {s.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Skills */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                <span>Learning ({currentUser.learningSkills.length})</span>
                <span className="text-[10px] text-sky-600 font-bold">Seeking peers</span>
              </div>
              <div className="space-y-2">
                {currentUser.learningSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-sky-50/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <div className="text-[10px] text-slate-500">Target: {s.proficiency} • {s.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Recent Learning Log
              </h3>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Full History
              </button>
            </div>

            <div className="p-5 space-y-3">
              {userActivities.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{act.skillName}</span>
                    <span className="text-slate-400 text-[11px]">{formatDate(act.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span
                      className={`font-semibold px-1.5 py-0.2 rounded ${
                        act.isTeaching
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {act.isTeaching ? 'Taught' : 'Learned'}
                    </span>
                    <span>•</span>
                    <span>{formatDuration(act.durationMinutes)}</span>
                    {act.partnerName && (
                      <>
                        <span>•</span>
                        <span>with {act.partnerName}</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-[11px]">{act.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invitations Alert */}
          {pendingRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  {pendingRequests.length} Pending Skill Swap Invitation!
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Peers want to exchange knowledge with you. Check your incoming requests.
                </p>
                <button
                  onClick={() => setActiveTab('partnerships')}
                  className="mt-2 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                >
                  Review Requests →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Modals for Dashboard */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={selectedUser}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <RequestPartnershipModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        targetUser={exchangeUser}
      />
    </div>
  );
};
