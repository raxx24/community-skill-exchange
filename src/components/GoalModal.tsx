import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LearningGoal, SkillCategory, LearningGoalMilestone } from '../types';
import { X, Target, Plus, Trash2, Calendar } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: LearningGoal | null;
}

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Design',
  'Communication',
  'Writing',
  'Media',
  'Business',
  'Other',
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { currentUser, addGoal, updateGoal } = useApp();

  const [title, setTitle] = useState('');
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<LearningGoalMilestone[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [error, setError] = useState('');

  // Default target date is 3 weeks ahead
  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setSkillName(goalToEdit.skillName);
      setCategory(goalToEdit.category);
      setDescription(goalToEdit.description);
      setTargetDate(goalToEdit.targetDate);
      setMilestones(goalToEdit.milestones);
    } else {
      setTitle('');
      setSkillName(
        currentUser?.learningSkills[0]?.name ||
          currentUser?.teachingSkills[0]?.name ||
          'Web Development'
      );
      setCategory('Programming');
      setDescription('');
      setTargetDate(defaultFutureDate());
      setMilestones([
        {
          id: `m-${Date.now()}-1`,
          title: 'Review foundational documentation & setup roadmap',
          completed: false,
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Hold 1-on-1 collaborative pairing session with learning partner',
          completed: false,
        },
      ]);
    }
    setError('');
  }, [goalToEdit, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    const newM: LearningGoalMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: newMilestoneText.trim(),
      completed: false,
    };
    setMilestones([...milestones, newM]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a goal title.');
      return;
    }
    if (!skillName.trim()) {
      setError('Please specify the skill this goal belongs to.');
      return;
    }
    if (!targetDate) {
      setError('Please select a target deadline date.');
      return;
    }

    const completedCount = milestones.filter((m) => m.completed).length;
    const total = milestones.length;
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const status =
      progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';

    if (goalToEdit) {
      updateGoal({
        ...goalToEdit,
        title: title.trim(),
        skillName: skillName.trim(),
        category,
        description: description.trim(),
        targetDate,
        milestones,
        progress,
        status,
        completedAt: status === 'Completed' ? new Date().toISOString().slice(0, 10) : undefined,
      });
    } else {
      addGoal({
        title: title.trim(),
        skillName: skillName.trim(),
        category,
        description: description.trim(),
        targetDate,
        milestones,
        progress,
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded-full">
              Growth Milestone
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {goalToEdit ? 'Edit Learning Goal' : 'Create New Learning Goal'}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            Set structured milestones and track your skill acquisition roadmap.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Figma Auto-Layout & Component Tokens"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Related Skill *
              </label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. UI/UX & Figma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Target Deadline *
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Description & Success Criteria
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What tangible output or understanding proves you achieved this goal?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Milestones list */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Actionable Milestones ({milestones.length})
            </label>

            <div className="space-y-2 mb-3">
              {milestones.map((m, index) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <span className="text-slate-700 text-xs flex-1 pr-2">
                    <span className="font-bold text-slate-400 mr-2">{index + 1}.</span>
                    {m.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add milestone checkpoint..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {goalToEdit ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
