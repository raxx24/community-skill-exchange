import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SkillItem } from '../types';
import { getCategoryBadgeClass, getProficiencyBadgeClass } from '../utils/formatters';
import { SkillModal } from '../components/SkillModal';

export const MySkillsView: React.FC = () => {
  const { currentUser, removeSkill } = useApp();

  const [activeTab, setActiveTab] = useState<'teaching' | 'learning'>('teaching');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'teaching' | 'learning'>('teaching');
  const [skillToEdit, setSkillToEdit] = useState<SkillItem | null>(null);

  const handleOpenAdd = (type: 'teaching' | 'learning') => {
    setModalType(type);
    setSkillToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: 'teaching' | 'learning', skill: SkillItem) => {
    setModalType(type);
    setSkillToEdit(skill);
    setIsModalOpen(true);
  };

  if (!currentUser) return null;

  const currentSkills =
    activeTab === 'teaching' ? currentUser.teachingSkills : currentUser.learningSkills;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Management Portfolio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain the skills you can mentor others in, and the skills you are actively looking to develop.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd(activeTab)}
          className={`px-4 py-2.5 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 self-start sm:self-auto ${
            activeTab === 'teaching'
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Skill to {activeTab === 'teaching' ? 'Teach' : 'Learn'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('teaching')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'teaching'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Skills I Can Teach ({currentUser.teachingSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('learning')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'learning'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Skills I Want to Learn ({currentUser.learningSkills.length})
        </button>
      </div>

      {/* Skills Grid */}
      {currentSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSkills.map((skill) => {
            const catClass = getCategoryBadgeClass(skill.category);
            const profClass = getProficiencyBadgeClass(skill.proficiency);

            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all p-5 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold border ${catClass.bg} ${catClass.text} ${catClass.border}`}
                    >
                      {skill.category}
                    </span>

                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold ${profClass.bg}`}
                    >
                      {activeTab === 'teaching' ? skill.proficiency : `Goal: ${skill.proficiency}`}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{skill.name}</h3>
                    {skill.yearsExperience !== undefined && skill.yearsExperience > 0 && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'} experience
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {skill.description}
                  </p>

                  {skill.availabilityNotes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{skill.availabilityNotes}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(activeTab, skill)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => removeSkill(activeTab, skill.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-800 text-base">
              No {activeTab} skills listed yet
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              {activeTab === 'teaching'
                ? 'Add skills you are proficient in so peers can request mentorship or propose mutual exchanges.'
                : 'Add skills you want to learn so our matching engine can recommend appropriate mentors and swap partners.'}
            </p>
            <button
              onClick={() => handleOpenAdd(activeTab)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Add First {activeTab === 'teaching' ? 'Teaching' : 'Learning'} Skill
            </button>
          </div>
        </div>
      )}

      {/* Global Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        skillToEdit={skillToEdit}
      />
    </div>
  );
};
