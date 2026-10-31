import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Clock,
  Target,
  GraduationCap,
  BookOpen,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { exportActivitiesToCsv, exportGoalsToCsv } from '../utils/exportCsv';
import { formatDate, formatDuration, getCategoryBadgeClass } from '../utils/formatters';

export const AnalyticsView: React.FC = () => {
  const { currentUser, activities, goals, requests } = useApp();

  const [timeRange, setTimeRange] = useState<'All Time' | 'Last 30 Days'>('All Time');

  if (!currentUser) return null;

  const userActivities = activities.filter((a) => a.userId === currentUser.id);
  const userGoals = goals.filter((g) => g.userId === currentUser.id);

  // Time metrics
  const totalMinutes = userActivities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const teachingMinutes = userActivities
    .filter((a) => a.isTeaching)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const teachingHours = (teachingMinutes / 60).toFixed(1);
  const teachingPct = totalMinutes > 0 ? Math.round((teachingMinutes / totalMinutes) * 100) : 0;

  const learningMinutes = userActivities
    .filter((a) => !a.isTeaching)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const learningHours = (learningMinutes / 60).toFixed(1);
  const learningPct = totalMinutes > 0 ? 100 - teachingPct : 0;

  // Goals metrics
  const completedGoals = userGoals.filter((g) => g.status === 'Completed').length;
  const inProgressGoals = userGoals.filter((g) => g.status === 'In Progress').length;
  const goalCompletionPct =
    userGoals.length > 0 ? Math.round((completedGoals / userGoals.length) * 100) : 0;

  // Category Breakdown
  const categoryHours: { [cat: string]: number } = {};
  userActivities.forEach((act) => {
    categoryHours[act.category] = (categoryHours[act.category] || 0) + act.durationMinutes / 60;
  });

  const categoryList = Object.entries(categoryHours).sort((a, b) => b[1] - a[1]);

  // Activity Type Breakdown
  const activityTypeCount: { [type: string]: number } = {};
  userActivities.forEach((act) => {
    activityTypeCount[act.activityType] = (activityTypeCount[act.activityType] || 0) + 1;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportActivities = () => {
    exportActivitiesToCsv(userActivities, currentUser);
  };

  const handleExportGoals = () => {
    exportGoalsToCsv(userGoals, currentUser);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Analytics & Growth Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quantify your skill acquisition, mentoring balance, and download verified learning reports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Report
          </button>
          <button
            onClick={handleExportActivities}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            Activities CSV
          </button>
          <button
            onClick={handleExportGoals}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-purple-600" />
            Goals CSV
          </button>
        </div>
      </div>

      {/* Printable Report Header for print view */}
      <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">SkillBridge Community Learning Report</h1>
        <p className="text-sm text-slate-600 mt-1">
          Learner: <strong>{currentUser.name}</strong> ({currentUser.email}) • Generated {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Logged Time
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1">{totalHours} hrs</div>
          <div className="text-xs text-slate-500 mt-1">{userActivities.length} total sessions recorded</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Goal Completion Rate
          </div>
          <div className="text-3xl font-black text-purple-700 mt-1">{goalCompletionPct}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {completedGoals} completed, {inProgressGoals} in progress
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Teaching Contribution
          </div>
          <div className="text-3xl font-black text-indigo-700 mt-1">{teachingHours} hrs</div>
          <div className="text-xs text-slate-500 mt-1">{teachingPct}% of your total network time</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Streak
          </div>
          <div className="text-3xl font-black text-amber-600 mt-1">{currentUser.streakDays} Days</div>
          <div className="text-xs text-slate-500 mt-1">Continuous learning engagement</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teaching vs Learning Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Knowledge Sharing Balance (Teaching vs Learning)
          </h3>
          <p className="text-xs text-slate-500">
            A healthy exchange platform balances absorbing new skills and giving back to peers.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-800 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  Mentoring / Teaching: {teachingHours} hrs
                </span>
                <span className="font-bold text-indigo-900">{teachingPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${teachingPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-teal-800 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Practicing / Learning: {learningHours} hrs
                </span>
                <span className="font-bold text-teal-900">{learningPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${learningPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Time Spent by Skill Category
          </h3>
          <p className="text-xs text-slate-500">
            Breakdown of logged hours across your focal domains.
          </p>

          <div className="space-y-3 pt-2">
            {categoryList.map(([cat, hours]) => {
              const maxCatHours = categoryList[0][1] || 1;
              const catPct = Math.round((hours / maxCatHours) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900 font-bold">{hours.toFixed(1)} hrs</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Formats Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Activity Breakdown by Collaboration Format
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Frequency of each session format in your learning history.
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(activityTypeCount).map(([type, count]) => (
              <div
                key={type}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1"
              >
                <div className="text-xl font-black text-slate-900">{count}</div>
                <div className="text-[11px] font-semibold text-slate-600 line-clamp-1">{type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
