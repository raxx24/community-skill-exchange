import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import { formatRelativeDate } from '../utils/formatters';
import { UserProfileModal } from '../components/UserProfileModal';
import { UserProfile, PartnershipRequest } from '../types';

export const PartnershipsView: React.FC = () => {
  const { currentUser, allUsers, requests, updateRequestStatus, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'all'>('incoming');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  if (!currentUser) return null;

  // Filter requests
  const incomingRequests = requests.filter((r) => r.receiverId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.senderId === currentUser.id);

  const displayedRequests =
    activeTab === 'incoming'
      ? incomingRequests
      : activeTab === 'outgoing'
      ? outgoingRequests
      : requests.filter(
          (r) => r.senderId === currentUser.id || r.receiverId === currentUser.id
        );

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  const handleOpenUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsUserProfileOpen(true);
    }
  };

  const handleAccept = (request: PartnershipRequest) => {
    updateRequestStatus(request.id, 'accepted');
  };

  const handleDecline = (request: PartnershipRequest) => {
    updateRequestStatus(request.id, 'declined');
  };

  const handleMarkComplete = (request: PartnershipRequest) => {
    updateRequestStatus(request.id, 'completed');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Exchange Partnerships & Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Coordinate mutual learning partnerships, accept new connection requests, and manage exchange commitments.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Incoming Requests</span>
          {pendingIncomingCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'incoming'
                  ? 'bg-white text-indigo-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {pendingIncomingCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'outgoing'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sent Requests ({outgoingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activity ({incomingRequests.length + outgoingRequests.length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {displayedRequests.length > 0 ? (
          displayedRequests.map((req) => {
            const isIncoming = req.receiverId === currentUser.id;
            const otherUserName = isIncoming ? req.senderName : req.receiverName;
            const otherUserAvatar = isIncoming ? req.senderAvatar : req.receiverAvatar;
            const otherUserId = isIncoming ? req.senderId : req.receiverId;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Partner avatar & identity */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={otherUserAvatar}
                      alt={otherUserName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenUser(otherUserId)}
                          className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors"
                        >
                          {otherUserName}
                        </button>
                        <span className="text-xs text-slate-400">
                          {isIncoming ? 'sent you a swap invitation' : 'you invited to exchange'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Format: <span className="font-semibold text-slate-700">{req.preferredFormat}</span> •{' '}
                        {formatRelativeDate(req.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : req.status === 'completed'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : req.status === 'declined'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.status === 'accepted' && <Check className="w-3.5 h-3.5" />}
                      {req.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {req.status === 'declined' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Skill exchange specifics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">
                      {isIncoming ? `${otherUserName.split(' ')[0]} Offers to Teach:` : 'You Offer to Teach:'}
                    </span>
                    <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      💡 {req.offeredSkill}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">
                      {isIncoming ? `${otherUserName.split(' ')[0]} Requests to Learn:` : 'You Request to Learn:'}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      🎯 {req.requestedSkill}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                {req.message && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>"{req.message}"</span>
                  </div>
                )}

                {/* Actions for Incoming pending */}
                {isIncoming && req.status === 'pending' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleDecline(req)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Accept Exchange
                    </button>
                  </div>
                )}

                {/* Actions for Active / Accepted partnerships */}
                {req.status === 'accepted' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/50 p-2.5 rounded-xl">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Active Exchange! Ready to schedule sessions.
                    </span>
                    <button
                      onClick={() => handleMarkComplete(req)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Mark Completed
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-bold text-slate-800 text-base">
                No {activeTab} requests right now
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Explore the directory or check your skill matches to propose exchanges with community peers!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Global Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};
