import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRightLeft,
  Sparkles,
  GraduationCap,
  BookOpen,
  Send,
  Star,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { computeMatches } from '../utils/matchingAlgorithm';
import { UserProfileModal } from '../components/UserProfileModal';
import { RequestPartnershipModal } from '../components/RequestPartnershipModal';
import { UserProfile, SkillMatch } from '../types';

export const MatchesView: React.FC = () => {
  const { currentUser, allUsers, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'mutual' | 'mentor' | 'peer-learner'>('all');
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [exchangeUser, setExchangeUser] = useState<UserProfile | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  if (!currentUser) return null;

  // Compute all matches
  const allMatches = computeMatches(currentUser, allUsers);

  // Filter based on selected tab
  const filteredMatches = allMatches.filter((match) => {
    if (activeFilter === 'all') return true;
    return match.matchType === activeFilter;
  });

  const mutualCount = allMatches.filter((m) => m.matchType === 'mutual').length;
  const mentorCount = allMatches.filter((m) => m.matchType === 'mentor').length;
  const learnerCount = allMatches.filter((m) => m.matchType === 'peer-learner').length;

  const toggleSaveMatch = (partnerId: string, partnerName: string) => {
    if (savedMatchIds.includes(partnerId)) {
      setSavedMatchIds((prev) => prev.filter((id) => id !== partnerId));
      showToast(`Removed ${partnerName} from saved matches.`, 'info');
    } else {
      setSavedMatchIds((prev) => [...prev, partnerId]);
      showToast(`Saved match with ${partnerName}!`, 'success');
    }
  };

  const handleOpenUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  const handleOpenExchange = (user: UserProfile) => {
    setExchangeUser(user);
    setIsExchangeModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI-Assisted Skill Compatibility Engine
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Matches & Mutual Exchanges
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            We analyzed your {currentUser.teachingSkills.length} teaching skills and {currentUser.learningSkills.length} learning goals against the community network.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Recommendations ({allMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('mutual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'mutual'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Mutual Exchanges ({mutualCount})
        </button>
        <button
          onClick={() => setActiveFilter('mentor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'mentor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Mentors for You ({mentorCount})
        </button>
        <button
          onClick={() => setActiveFilter('peer-learner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'peer-learner'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Seeking Your Skills ({learnerCount})
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const { partner, matchType, matchScore, reason, teachSkillsMatched, learnSkillsMatched } = match;
          const isSaved = savedMatchIds.includes(partner.id);
          const isMutual = matchType === 'mutual';

          return (
            <div
              key={partner.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                isMutual
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10 bg-gradient-to-br from-white via-white to-emerald-50/20'
                  : 'border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Partner Details */}
                <div className="flex items-start gap-4">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenUser(partner)}
                        className="font-extrabold text-slate-900 text-base sm:text-lg hover:text-indigo-600 transition-colors text-left"
                      >
                        {partner.name}
                      </button>

                      {/* Badge indicator */}
                      {isMutual ? (
                        <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3" />
                          Mutual Exchange
                        </span>
                      ) : matchType === 'mentor' ? (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                          Mentor Match
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full">
                          Peer Learner
                        </span>
                      )}

                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {matchScore}% Compatibility
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{partner.headline}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {partner.rating.toFixed(1)} ({partner.reviewCount} reviews)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {partner.availabilityHoursPerWeek} hrs/week
                      </span>
                      <span>•</span>
                      <span>{partner.location}</span>
                    </div>
                  </div>
                </div>

                {/* Match Action Buttons */}
                <div className="flex sm:flex-row lg:flex-col items-center sm:items-stretch gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => handleOpenExchange(partner)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Propose Skill Exchange
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenUser(partner)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex-1 text-center"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => toggleSaveMatch(partner.id, partner.name)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Unsave match' : 'Save match for later'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Explanation & Synergy Details */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Why recommended */}
                <div className="md:col-span-1 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Why Recommended
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{reason}</p>
                </div>

                {/* What they can teach you */}
                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
                  <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    {partner.name.split(' ')[0]} Teaches You:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teachSkillsMatched.length > 0 ? (
                      teachSkillsMatched.map((s) => (
                        <span
                          key={s}
                          className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">General peer mentorship</span>
                    )}
                  </div>
                </div>

                {/* What you can teach them */}
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                  <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    You Teach {partner.name.split(' ')[0]}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {learnSkillsMatched.length > 0 ? (
                      learnSkillsMatched.map((s) => (
                        <span
                          key={s}
                          className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">One-way learning format</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Modals */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={selectedUser}
      />

      <RequestPartnershipModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        targetUser={exchangeUser}
      />
    </div>
  );
};
