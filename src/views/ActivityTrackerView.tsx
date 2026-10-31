import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Plus,
  Calendar,
  Download,
  GraduationCap,
  BookOpen,
  Trash2,
  Search,
  Filter,
  Users,
} from 'lucide-react';
import { formatDate, formatDuration, getCategoryBadgeClass } from '../utils/formatters';
import { exportActivitiesToCsv } from '../utils/exportCsv';
import { ActivityModal } from '../components/ActivityModal';

export const ActivityTrackerView: React.FC = () => {
  const { currentUser, activities, deleteActivity } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Teaching' | 'Learning'>('All');

  if (!currentUser) return null;

  const userActivities = activities.filter((a) => a.userId === currentUser.id);

  // Statistics
  const totalMinutes = userActivities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const teachingActivities = userActivities.filter((a) => a.isTeaching);
  const teachingMinutes = teachingActivities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const teachingHours = (teachingMinutes / 60).toFixed(1);

  const learningActivities = userActivities.filter((a) => !a.isTeaching);
  const learningMinutes = learningActivities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const learningHours = (learningMinutes / 60).toFixed(1);

  // Filtered Activities
  const filteredActivities = userActivities.filter((act) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesQuery =
      !q ||
      act.skillName.toLowerCase().includes(q) ||
      (act.partnerName && act.partnerName.toLowerCase().includes(q)) ||
      act.notes.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (roleFilter === 'Teaching' && !act.isTeaching) return false;
    if (roleFilter === 'Learning' && act.isTeaching) return false;

    return true;
  });

  const handleExportCsv = () => {
    exportActivitiesToCsv(filteredActivities, currentUser);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Activity Log & History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep an audit trail of every collaborative exchange, mentoring session, and practice milestone.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            title="Download CSV report of your logged activities"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Log Session
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Logged Time
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalHours} hrs</div>
          <div className="text-xs text-slate-500 mt-0.5">{userActivities.length} sessions recorded</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Mentoring / Taught
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-1">{teachingHours} hrs</div>
          <div className="text-xs text-slate-500 mt-0.5">{teachingActivities.length} sharing sessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Learning / Practiced
          </div>
          <div className="text-2xl font-black text-teal-900 mt-1">{learningHours} hrs</div>
          <div className="text-xs text-slate-500 mt-0.5">{learningActivities.length} learning sessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Peer Collaboration
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {userActivities.filter((a) => a.partnerName).length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Sessions with community partners</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skill, partner, or session keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('All')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('Teaching')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'Teaching'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Teaching
          </button>
          <button
            onClick={() => setRoleFilter('Learning')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'Learning'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Learning
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => {
            const catClass = getCategoryBadgeClass(act.category);

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        act.isTeaching
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {act.isTeaching ? 'Teaching / Mentoring' : 'Learning / Practicing'}
                    </span>

                    <span className="font-bold text-slate-900 text-base">{act.skillName}</span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${catClass.bg} ${catClass.text} ${catClass.border}`}
                    >
                      {act.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatDuration(act.durationMinutes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(act.date)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap gap-4 pt-1">
                  <span>
                    <strong className="text-slate-700">Format:</strong> {act.activityType}
                  </span>
                  {act.partnerName && (
                    <span>
                      <strong className="text-slate-700">Partner:</strong> {act.partnerName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {act.notes}
                </p>

                {/* Key Takeaways */}
                {act.keyTakeaways && act.keyTakeaways.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Key Takeaways & Insights
                    </div>
                    <div className="space-y-1">
                      {act.keyTakeaways.map((item, i) => (
                        <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-teal-600">💡</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Record
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-bold text-slate-800 text-base">
                No activity logs match your filter
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Record your learning and mentoring hours to track growth over time.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors"
              >
                Log First Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
