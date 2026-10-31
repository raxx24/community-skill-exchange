import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  ArrowRightLeft,
  Star,
  MapPin,
  Clock,
  Sparkles,
  UserX,
  X,
} from 'lucide-react';
import { UserProfile, SkillCategory, ProficiencyLevel, LearningFormat } from '../types';
import { getCategoryBadgeClass, getProficiencyBadgeClass } from '../utils/formatters';
import { UserProfileModal } from '../components/UserProfileModal';
import { RequestPartnershipModal } from '../components/RequestPartnershipModal';

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Design',
  'Communication',
  'Writing',
  'Media',
  'Business',
  'Other',
];

const FORMATS: LearningFormat[] = [
  '1-on-1 Video',
  'Async Feedback & Review',
  'Hands-on Pairing',
  'Chat & Resource Sharing',
  'Group Workshop',
];

export const DiscoverView: React.FC = () => {
  const { allUsers, currentUser } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('All');
  const [intentFilter, setIntentFilter] = useState<'All' | 'Can Teach' | 'Wants to Learn'>('All');
  const [formatFilter, setFormatFilter] = useState<string>('All');

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [exchangeUser, setExchangeUser] = useState<UserProfile | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  // Filtered users list (excluding currentUser or showing them clearly)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      // Don't exclude currentUser so they can see how their own profile looks in the directory, but flag it
      const q = searchTerm.toLowerCase().trim();

      // Text search in name, headline, bio, skills
      const matchesName = user.name.toLowerCase().includes(q);
      const matchesHeadline = user.headline.toLowerCase().includes(q);
      const matchesBio = user.bio.toLowerCase().includes(q);
      const matchesTeach = user.teachingSkills.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
      const matchesLearn = user.learningSkills.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );

      const matchesSearch =
        !q || matchesName || matchesHeadline || matchesBio || matchesTeach || matchesLearn;
      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'All') {
        const hasTeachCategory = user.teachingSkills.some(
          (s) => s.category === selectedCategory
        );
        const hasLearnCategory = user.learningSkills.some(
          (s) => s.category === selectedCategory
        );
        if (!hasTeachCategory && !hasLearnCategory) return false;
      }

      // Proficiency filter
      if (selectedProficiency !== 'All') {
        const hasTeachProf = user.teachingSkills.some(
          (s) => s.proficiency === selectedProficiency
        );
        const hasLearnProf = user.learningSkills.some(
          (s) => s.proficiency === selectedProficiency
        );
        if (!hasTeachProf && !hasLearnProf) return false;
      }

      // Intent filter (can teach vs wants to learn)
      if (intentFilter === 'Can Teach') {
        if (selectedCategory !== 'All') {
          if (!user.teachingSkills.some((s) => s.category === selectedCategory)) return false;
        } else if (user.teachingSkills.length === 0) {
          return false;
        }
      } else if (intentFilter === 'Wants to Learn') {
        if (selectedCategory !== 'All') {
          if (!user.learningSkills.some((s) => s.category === selectedCategory)) return false;
        } else if (user.learningSkills.length === 0) {
          return false;
        }
      }

      // Format filter
      if (formatFilter !== 'All') {
        if (!user.preferredFormats.includes(formatFilter as LearningFormat)) return false;
      }

      return true;
    });
  }, [
    allUsers,
    searchTerm,
    selectedCategory,
    selectedProficiency,
    intentFilter,
    formatFilter,
  ]);

  const handleOpenUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  const handleOpenExchange = (user: UserProfile) => {
    setExchangeUser(user);
    setIsExchangeModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedProficiency('All');
    setIntentFilter('All');
    setFormatFilter('All');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedProficiency !== 'All' ||
    intentFilter !== 'All' ||
    formatFilter !== 'All';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Community Skill Directory & Search
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse students, mentors, and peers across categories. Discover what others can teach and what they want to learn.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-auto">
          Showing <span className="text-indigo-600 font-bold">{filteredUsers.length}</span> members
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by person name, skill, topic, or role (e.g. React, Figma, Python, Writing)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Intent */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Intent
            </label>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Intents</option>
              <option value="Can Teach">Can Teach</option>
              <option value="Wants to Learn">Wants to Learn</option>
            </select>
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Proficiency
            </label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Learning Format
            </label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Formats</option>
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Filtered view active</span>
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const isMe = currentUser ? user.id === currentUser.id : false;

            return (
              <div
                key={user.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  isMe ? 'border-indigo-400 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Top Profile Summary */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleOpenUser(user)}
                          className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors truncate"
                        >
                          {user.name}
                        </button>
                        {isMe && (
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{user.headline}</p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {user.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {user.location.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>

                  {/* Skills Offered (Can Teach) */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      Can Teach ({user.teachingSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.teachingSkills.slice(0, 3).map((skill) => {
                        const catClass = getCategoryBadgeClass(skill.category);
                        return (
                          <span
                            key={skill.id}
                            className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium ${catClass.bg} ${catClass.text} ${catClass.border}`}
                          >
                            {skill.name}
                          </span>
                        );
                      })}
                      {user.teachingSkills.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{user.teachingSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills Sought (Wants to Learn) */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      Wants to Learn ({user.learningSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.learningSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="text-[11px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {user.learningSkills.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{user.learningSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {user.availabilityHoursPerWeek}h/wk
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenUser(user)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
                    >
                      Profile
                    </button>
                    {!isMe && (
                      <button
                        onClick={() => handleOpenExchange(user)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Swap Skills
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <UserX className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-800 text-base">
              No matching members found
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Try adjusting your search keywords, broadening category filters, or resetting the intent filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

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
