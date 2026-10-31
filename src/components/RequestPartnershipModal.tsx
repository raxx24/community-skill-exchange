import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, LearningFormat } from '../types';
import { X, Send, ArrowRightLeft, Clock, MessageSquare, CheckCircle } from 'lucide-react';

interface RequestPartnershipModalProps {
  targetUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  preselectedSkillToLearn?: string;
}

export const RequestPartnershipModal: React.FC<RequestPartnershipModalProps> = ({
  targetUser,
  isOpen,
  onClose,
  preselectedSkillToLearn,
}) => {
  const { currentUser, sendPartnershipRequest } = useApp();

  if (!isOpen || !targetUser || !currentUser) return null;

  const defaultOffered = currentUser.teachingSkills[0]?.name || 'Peer Knowledge Sharing';
  const defaultRequested =
    preselectedSkillToLearn ||
    targetUser.teachingSkills[0]?.name ||
    'General Consultation';

  const [offeredSkill, setOfferedSkill] = useState(defaultOffered);
  const [requestedSkill, setRequestedSkill] = useState(defaultRequested);
  const [preferredFormat, setPreferredFormat] = useState<LearningFormat>(
    targetUser.preferredFormats[0] || '1-on-1 Video'
  );
  const [message, setMessage] = useState(
    `Hi ${targetUser.name.split(' ')[0]}! I'd love to connect on SkillBridge to learn ${defaultRequested}. In return, I can help you with ${defaultOffered} or collaborate together!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPartnershipRequest(
      targetUser.id,
      offeredSkill,
      requestedSkill,
      message,
      preferredFormat
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded-full">
              Exchange Invitation
            </span>
          </div>
          <h2 className="text-xl font-bold">Connect with {targetUser.name}</h2>
          <p className="text-teal-100 text-sm mt-1">
            Propose a mutual skill exchange or request a learning partnership.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Target Profile summary card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <img
              src={targetUser.avatar}
              alt={targetUser.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-300"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-800 text-sm">{targetUser.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-1">{targetUser.headline}</p>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {targetUser.availabilityHoursPerWeek} hrs/week available • {targetUser.location}
              </div>
            </div>
          </div>

          {/* Requested Skill (what you want from them) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Skill You Wish to Learn (Offered by {targetUser.name.split(' ')[0]})
            </label>
            <select
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {targetUser.teachingSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.proficiency} - {s.category})
                </option>
              ))}
              <option value="General Advice & Mentorship">General Advice & Mentorship</option>
            </select>
          </div>

          {/* Offered Skill (what you provide in return) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Skill You Can Offer in Exchange
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {currentUser.teachingSkills.length > 0 ? (
                currentUser.teachingSkills.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.proficiency} - {s.category})
                  </option>
                ))
              ) : (
                <option value="General Assistance & Co-working">General Assistance & Co-working</option>
              )}
              <option value="One-Way Mentorship Request (No teaching)">
                One-Way Mentorship Request (No direct teaching)
              </option>
            </select>
          </div>

          {/* Preferred Format */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Preferred Format
            </label>
            <select
              value={preferredFormat}
              onChange={(e) => setPreferredFormat(e.target.value as LearningFormat)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="1-on-1 Video">1-on-1 Video (Zoom / Google Meet)</option>
              <option value="Hands-on Pairing">Hands-on Pairing (Live Code / Figma)</option>
              <option value="Async Feedback & Review">Async Feedback & Review (Loom / Docs)</option>
              <option value="Chat & Resource Sharing">Chat & Resource Sharing</option>
              <option value="Group Workshop">Group Workshop</option>
            </select>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Personalized Note / Goal
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Explain what specific challenges you're working on..."
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
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
