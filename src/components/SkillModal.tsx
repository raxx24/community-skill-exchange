import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SkillCategory, ProficiencyLevel, SkillItem } from '../types';
import { X, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'teaching' | 'learning';
  skillToEdit?: SkillItem | null;
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

const PROFICIENCIES: ProficiencyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  type,
  skillToEdit,
}) => {
  const { addSkill, updateSkill } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [description, setDescription] = useState('');
  const [availabilityNotes, setAvailabilityNotes] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setCategory(skillToEdit.category);
      setProficiency(skillToEdit.proficiency);
      setDescription(skillToEdit.description);
      setAvailabilityNotes(skillToEdit.availabilityNotes || '');
      setYearsExperience(skillToEdit.yearsExperience);
    } else {
      setName('');
      setCategory('Programming');
      setProficiency(type === 'teaching' ? 'Advanced' : 'Beginner');
      setDescription('');
      setAvailabilityNotes('');
      setYearsExperience(undefined);
    }
    setError('');
  }, [skillToEdit, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a skill name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description of what you cover or seek.');
      return;
    }

    if (skillToEdit) {
      updateSkill(type, {
        id: skillToEdit.id,
        name: name.trim(),
        category,
        proficiency,
        description: description.trim(),
        availabilityNotes: availabilityNotes.trim(),
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
      });
    } else {
      addSkill(type, {
        name: name.trim(),
        category,
        proficiency,
        description: description.trim(),
        availabilityNotes: availabilityNotes.trim(),
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
      });
    }

    onClose();
  };

  const isTeaching = type === 'teaching';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`p-6 text-white relative ${
            isTeaching
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-800'
              : 'bg-gradient-to-r from-sky-600 to-blue-700'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            {isTeaching ? (
              <GraduationCap className="w-5 h-5" />
            ) : (
              <BookOpen className="w-5 h-5" />
            )}
            <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded-full">
              {isTeaching ? 'Teaching Skill' : 'Skill to Learn'}
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {skillToEdit ? `Edit Skill` : `Add Skill to ${isTeaching ? 'Teach' : 'Learn'}`}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {isTeaching
              ? 'Specify what knowledge or mentorship you can share with peers.'
              : 'Identify skills you want to build with community study partners.'}
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
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isTeaching
                  ? 'e.g. React & TypeScript, UI Motion, Technical Writing'
                  : 'e.g. Figma Design Systems, Public Speaking, D3.js'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                {isTeaching ? 'Your Proficiency Level *' : 'Target / Current Level *'}
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {PROFICIENCIES.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isTeaching && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Years of Experience (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsExperience ?? ''}
                onChange={(e) =>
                  setYearsExperience(e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="e.g. 3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Short Description & Scope *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isTeaching
                  ? 'What specific subtopics, tools, or techniques can you help with?'
                  : 'What are you aiming to learn or build? What challenges are you having?'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Availability / Scheduling Notes
            </label>
            <input
              type="text"
              value={availabilityNotes}
              onChange={(e) => setAvailabilityNotes(e.target.value)}
              placeholder="e.g. 1 hr/week on weekends, or async pull-request reviews"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
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
              className={`px-5 py-2.5 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2 ${
                isTeaching
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {skillToEdit ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
