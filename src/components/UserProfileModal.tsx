import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { getCategoryBadgeClass, getProficiencyBadgeClass } from '../utils/formatters';
import { RequestPartnershipModal } from './RequestPartnershipModal';
import {
  X,
  Star,
  MapPin,
  Building,
  Clock,
  Flame,
  ArrowRightLeft,
  CheckCircle,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSkillToLearn, setSelectedSkillToLearn] = useState<string | undefined>(undefined);

  if (!isOpen || !user) return null;

  const isCurrentUser = currentUser ? user.id === currentUser.id : false;

  const handleOpenExchange = (skillName?: string) => {
    setSelectedSkillToLearn(skillName);
    setIsRequestModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
          {/* Cover & Avatar Header */}
          <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 pt-7 pb-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/60 shadow-md"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-300/30">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{user.rating.toFixed(1)}</span>
                    <span className="text-white/60">({user.reviewCount})</span>
                  </div>
                </div>
                <p className="text-indigo-200 text-sm font-medium">{user.headline}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-indigo-200/90">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {user.institution || user.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Flame className="w-3.5 h-3.5 fill-amber-300" />
                    {user.streakDays} day streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                About & Learning Style
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {user.bio}
              </p>
            </div>

            {/* Availability & Preferred formats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Availability
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {user.availabilityHoursPerWeek} hours / week
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {user.availabilitySchedule}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Preferred Formats
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user.preferredFormats.map((fmt) => (
                    <span
                      key={fmt}
                      className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Offered (Can Teach) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Skills {user.name.split(' ')[0]} Can Teach ({user.teachingSkills.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {user.teachingSkills.map((skill) => {
                  const catClass = getCategoryBadgeClass(skill.category);
                  const prof = getProficiencyBadgeClass(skill.proficiency);
                  return (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-800">
                            {skill.name}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${catClass.bg} ${catClass.text} ${catClass.border}`}
                          >
                            {skill.category}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${prof.bg}`}
                          >
                            {skill.proficiency}
                          </span>
                        </div>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleOpenExchange(skill.name)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                          >
                            Request to Learn
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {skill.description}
                      </p>
                      {skill.availabilityNotes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Notes: {skill.availabilityNotes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Sought (Wants to Learn) */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Skills {user.name.split(' ')[0]} Wants to Learn ({user.learningSkills.length})
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {user.learningSkills.map((skill) => {
                  const catClass = getCategoryBadgeClass(skill.category);
                  const prof = getProficiencyBadgeClass(skill.proficiency);
                  return (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">
                          {skill.name}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${catClass.bg} ${catClass.text} ${catClass.border}`}
                        >
                          {skill.category}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${prof.bg}`}
                        >
                          Target: {skill.proficiency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            {user.interests.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Interests & Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((int) => (
                    <span
                      key={int}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      #{int}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with primary connect action */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Joined {user.joinedDate}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              {!isCurrentUser && (
                <button
                  onClick={() => handleOpenExchange()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Propose Skill Exchange
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Request Modal */}
      <RequestPartnershipModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        targetUser={user}
        preselectedSkillToLearn={selectedSkillToLearn}
      />
    </>
  );
};
