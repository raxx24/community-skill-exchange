import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityType, SkillCategory } from '../types';
import { X, Clock, Plus, Trash2, Calendar, BookOpen, GraduationCap } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTIVITY_TYPES: ActivityType[] = [
  '1-on-1 Mentoring',
  'Mutual Skill Swap',
  'Pair Programming / Co-working',
  'Feedback & Review',
  'Independent Study & Practice',
  'Group Workshop',
];

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Design',
  'Communication',
  'Writing',
  'Media',
  'Business',
  'Other',
];

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, allUsers, addActivity } = useApp();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [skillName, setSkillName] = useState(
    currentUser?.learningSkills[0]?.name ||
      currentUser?.teachingSkills[0]?.name ||
      'Modern Web Development'
  );
  const [category, setCategory] = useState<SkillCategory>('Programming');
  const [activityType, setActivityType] = useState<ActivityType>('Mutual Skill Swap');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isTeaching, setIsTeaching] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [notes, setNotes] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>([
    'Applied new concepts in real exercises',
  ]);
  const [newTakeaway, setNewTakeaway] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setTakeaways([...takeaways, newTakeaway.trim()]);
    setNewTakeaway('');
  };

  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError('Please provide a skill name.');
      return;
    }
    if (!durationMinutes || durationMinutes <= 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }
    if (!notes.trim()) {
      setError('Please write brief session notes summarizing what was done.');
      return;
    }

    addActivity({
      date,
      skillName: skillName.trim(),
      category,
      activityType,
      durationMinutes: Number(durationMinutes),
      partnerName: partnerName.trim() || undefined,
      notes: notes.trim(),
      keyTakeaways: takeaways,
      isTeaching,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded-full">
              Learning Activity Tracker
            </span>
          </div>
          <h2 className="text-xl font-bold">Log Skill Session / Exchange</h2>
          <p className="text-teal-100 text-sm mt-1">
            Record time spent learning, mentoring, or collaborating with peers.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Teaching vs Learning Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Your Primary Role in This Session
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsTeaching(false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  !isTeaching
                    ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                Learner / Student
              </button>
              <button
                type="button"
                onClick={() => setIsTeaching(true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  isTeaching
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Mentor / Teacher
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                step="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Skill Focused On *
              </label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. React Hooks, Figma Variants, Pitching"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Activity Type *
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Learning Partner (Optional)
              </label>
              <input
                type="text"
                list="peer-list"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Elena Vance or leave empty for solo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <datalist id="peer-list">
                {allUsers
                  .filter((u) => u.id !== currentUser?.id)
                  .map((u) => (
                    <option key={u.id} value={u.name} />
                  ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Session Notes & Summary *
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What topics were discussed? What challenges arose? How did you solve them?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Key Takeaways */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Key Insights & Action Items ({takeaways.length})
            </label>
            <div className="space-y-1.5 mb-2.5">
              {takeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <span className="text-slate-700 flex-1 pr-2">💡 {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTakeaway();
                  }
                }}
                placeholder="Add a key takeaway..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
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
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Save Activity Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
