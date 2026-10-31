import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Save,
  Clock,
  Sparkles,
  MapPin,
  Building,
  Star,
  Flame,
  BookOpen,
} from 'lucide-react';
import { LearningFormat } from '../types';

const ALL_FORMATS: LearningFormat[] = [
  '1-on-1 Video',
  'Async Feedback & Review',
  'Hands-on Pairing',
  'Chat & Resource Sharing',
  'Group Workshop',
];

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [role, setRole] = useState(currentUser?.role || '');
  const [institution, setInstitution] = useState(currentUser?.institution || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [availabilityHours, setAvailabilityHours] = useState(
    currentUser?.availabilityHoursPerWeek || 4
  );
  const [availabilitySchedule, setAvailabilitySchedule] = useState(
    currentUser?.availabilitySchedule || ''
  );
  const [preferredFormats, setPreferredFormats] = useState<LearningFormat[]>(
    currentUser?.preferredFormats || []
  );
  const [interestInput, setInterestInput] = useState(
    currentUser?.interests?.join(', ') || ''
  );

  if (!currentUser) return null;

  const toggleFormat = (fmt: LearningFormat) => {
    if (preferredFormats.includes(fmt)) {
      setPreferredFormats(preferredFormats.filter((f) => f !== fmt));
    } else {
      setPreferredFormats([...preferredFormats, fmt]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedInterests = interestInput
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    updateProfile({
      name: name.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      role: role.trim(),
      institution: institution.trim(),
      location: location.trim(),
      avatar: avatar.trim(),
      availabilityHoursPerWeek: Number(availabilityHours),
      availabilitySchedule: availabilitySchedule.trim(),
      preferredFormats,
      interests: parsedInterests,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Personal Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your bio, academic credentials, weekly availability, and learning exchange formats.
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Avatar & Summary preview */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-sm"
          />
          <div className="flex-1 w-full space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              Profile Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
            <p className="text-[11px] text-slate-400">
              Provide any valid image URL or Unsplash/Dicebear link.
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Role / Major *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Headline (Short Summary) *
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Institution / University / Company
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Location / Timezone
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Bio & Learning Background *
          </label>
          <textarea
            rows={4}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Availability Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Availability & Scheduling Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Hours Per Week
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={availabilityHours}
                onChange={(e) => setAvailabilityHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Preferred Schedule Window
              </label>
              <input
                type="text"
                value={availabilitySchedule}
                onChange={(e) => setAvailabilitySchedule(e.target.value)}
                placeholder="e.g. Weekday evenings (6-8pm PT), Saturdays 10am-1pm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Preferred Learning Formats */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Preferred Learning Formats (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ALL_FORMATS.map((fmt) => {
              const selected = preferredFormats.includes(fmt);
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => toggleFormat(fmt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected && '✓ '}
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Interests & Topic Tags (Comma separated)
          </label>
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder="e.g. Web Development, Design Systems, Hackathons, Mentorship"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
