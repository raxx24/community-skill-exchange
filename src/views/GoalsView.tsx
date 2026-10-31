import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { LearningGoal } from '../types';
import { formatDate, getCategoryBadgeClass } from '../utils/formatters';
import { GoalModal } from '../components/GoalModal';

export const GoalsView: React.FC = () => {
  const { currentUser, goals, toggleMilestone, deleteGoal } = useApp();

  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<LearningGoal | null>(null);

  if (!currentUser) return null;

  const userGoals = goals.filter((g) => g.userId === currentUser.id);

  const filteredGoals = userGoals.filter((g) => {
    if (filter === 'All') return true;
    return g.status === filter;
  });

  const handleOpenAdd = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: LearningGoal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  const completedCount = userGoals.filter((g) => g.status === 'Completed').length;
  const inProgressCount = userGoals.filter((g) => g.status === 'In Progress').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Goals & Milestones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define clear learning objectives, track sub-milestones with partners, and measure your progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setFilter('All')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'All'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Goals ({userGoals.length})
        </button>

        <button
          onClick={() => setFilter('In Progress')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'In Progress'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Progress ({inProgressCount})
        </button>

        <button
          onClick={() => setFilter('Completed')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            filter === 'Completed'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Goals List */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const catClass = getCategoryBadgeClass(goal.category);
            const isCompleted = goal.status === 'Completed';
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Status & Category badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold border ${catClass.bg} ${catClass.text} ${catClass.border}`}
                    >
                      {goal.category} • {goal.skillName}
                    </span>

                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {goal.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{goal.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target Date: {formatDate(goal.targetDate)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">
                        {completedMilestones} of {goal.milestones.length} milestones completed
                      </span>
                      <span className="text-purple-700 font-bold">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones interactive checklist */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Checkpoints (Click to toggle)
                    </div>
                    {goal.milestones.map((m) => (
                      <label
                        key={m.id}
                        className="flex items-start gap-2.5 text-xs cursor-pointer select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => toggleMilestone(goal.id, m.id)}
                          className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                        />
                        <span
                          className={`leading-tight transition-all ${
                            m.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-700 group-hover:text-slate-900'
                          }`}
                        >
                          {m.title}
                          {m.completedAt && (
                            <span className="text-[10px] text-slate-400 block font-normal">
                              Completed {formatDate(m.completedAt)}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Created {formatDate(goal.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-800 text-base">
              No {filter !== 'All' ? filter.toLowerCase() : ''} goals found
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Create a targeted learning goal with milestones to stay on schedule.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
            >
              Add First Learning Goal
            </button>
          </div>
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
      />
    </div>
  );
};
