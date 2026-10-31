import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  LearningGoal,
  LearningActivity,
  PartnershipRequest,
  Achievement,
  ActiveTab,
  SkillItem,
  LearningFormat,
  SkillCategory,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_GOALS,
  INITIAL_ACTIVITIES,
  INITIAL_REQUESTS,
  INITIAL_ACHIEVEMENTS,
} from '../data/mockData';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
  headline: string;
  bio?: string;
  institution?: string;
  location?: string;
  initialTeachingSkill?: string;
  initialTeachingCategory?: SkillCategory;
  initialLearningSkill?: string;
  initialLearningCategory?: SkillCategory;
}

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  allUsers: UserProfile[];
  goals: LearningGoal[];
  activities: LearningActivity[];
  requests: PartnershipRequest[];
  achievements: Achievement[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedUserForModal: UserProfile | null;
  openUserModal: (user: UserProfile) => void;
  closeUserModal: () => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Auth actions
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (payload: RegisterPayload) => { success: boolean; message?: string };
  logout: () => void;
  resetPassword: (email: string, newPass: string) => { success: boolean; message?: string };
  
  // User & Profile actions
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  // Skill actions
  addSkill: (type: 'teaching' | 'learning', skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (type: 'teaching' | 'learning', skill: SkillItem) => void;
  removeSkill: (type: 'teaching' | 'learning', skillId: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<LearningGoal, 'id' | 'userId' | 'createdAt'>) => void;
  updateGoal: (goal: LearningGoal) => void;
  deleteGoal: (goalId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  // Activity actions
  addActivity: (activity: Omit<LearningActivity, 'id' | 'userId'>) => void;
  deleteActivity: (activityId: string) => void;
  
  // Partnership actions
  sendPartnershipRequest: (
    receiverId: string,
    offeredSkill: string,
    requestedSkill: string,
    message: string,
    preferredFormat: LearningFormat
  ) => void;
  updateRequestStatus: (requestId: string, status: 'accepted' | 'declined' | 'completed') => void;
}

const STORAGE_KEY = 'skillbridge_platform_data_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users or defaults
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current session user ID (null if not logged in)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_user_id`);
      return saved || null;
    } catch {
      return null;
    }
  });

  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [activities, setActivities] = useState<LearningActivity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [requests, setRequests] = useState<PartnershipRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Find active current user or null
  const currentUser = currentUserId ? allUsers.find((u) => u.id === currentUserId) || null : null;
  const isAuthenticated = !!currentUser;

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
    } catch (e) {
      console.error(e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(`${STORAGE_KEY}_current_user_id`, currentUserId);
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_current_user_id`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
    } catch (e) {
      console.error(e);
    }
  }, [achievements]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Authentication: Login
  const login = (email: string, password?: string): { success: boolean; message?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address. Please register a new account.',
      };
    }

    // If user has a set password, verify it
    if (user.password && password && user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password. Please verify and try again.',
      };
    }

    setCurrentUserId(user.id);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.name}! Successfully signed in.`, 'success');
    return { success: true };
  };

  // Authentication: Register
  const register = (payload: RegisterPayload): { success: boolean; message?: string } => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newId = `user-${Date.now().toString(36)}`;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      payload.name.trim()
    )}`;

    const teachingSkills: SkillItem[] = [];
    if (payload.initialTeachingSkill?.trim()) {
      teachingSkills.push({
        id: `sk-t-${Date.now()}`,
        name: payload.initialTeachingSkill.trim(),
        category: payload.initialTeachingCategory || 'Programming',
        proficiency: 'Advanced',
        description: 'Available for peer mentoring, live pairing, and questions.',
        availabilityNotes: 'Flexible weekly sessions',
        yearsExperience: 2,
      });
    }

    const learningSkills: SkillItem[] = [];
    if (payload.initialLearningSkill?.trim()) {
      learningSkills.push({
        id: `sk-l-${Date.now()}`,
        name: payload.initialLearningSkill.trim(),
        category: payload.initialLearningCategory || 'Design',
        proficiency: 'Beginner',
        description: 'Actively seeking hands-on learning partnership and guidance.',
        availabilityNotes: 'Looking for weekly practice sessions',
      });
    }

    const newUser: UserProfile = {
      id: newId,
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password || 'password123',
      role: payload.role.trim() || 'Learner & Skill Exchanger',
      headline: payload.headline?.trim() || `${payload.role || 'Member'} passionate about skill growth`,
      avatar: avatarUrl,
      bio:
        payload.bio?.trim() ||
        `Hello! I'm ${payload.name.trim()}, excited to exchange practical skills, collaborate with learning partners, and achieve my learning milestones on SkillBridge.`,
      institution: payload.institution?.trim() || 'Community Network Member',
      location: payload.location?.trim() || 'Remote (Global)',
      preferredFormats: ['1-on-1 Video', 'Hands-on Pairing', 'Async Feedback & Review'],
      availabilityHoursPerWeek: 4,
      availabilitySchedule: 'Flexible evenings and weekends',
      teachingSkills,
      learningSkills,
      interests: ['Collaborative Learning', 'Skill Swapping', 'Mentorship'],
      streakDays: 1,
      rating: 5.0,
      reviewCount: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newId);
    setActiveTab('dashboard');
    showToast(`Account created successfully! Welcome to SkillBridge, ${newUser.name}.`, 'success');
    return { success: true };
  };

  // Authentication: Logout
  const logout = () => {
    setCurrentUserId(null);
    setActiveTab('dashboard');
    showToast('You have been signed out successfully.', 'info');
  };

  // Password reset
  const resetPassword = (email: string, newPass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = allUsers.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'No account associated with that email address.',
      };
    }

    setAllUsers((prev) =>
      prev.map((u, i) => (i === userIndex ? { ...u, password: newPass } : u))
    );
    showToast('Your password has been updated. You can now sign in.', 'success');
    return { success: true };
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
    );
    showToast('Profile updated successfully!', 'success');
  };

  // Skill Management
  const addSkill = (type: 'teaching' | 'learning', skill: Omit<SkillItem, 'id'>) => {
    if (!currentUser) return;
    const newSkill: SkillItem = {
      ...skill,
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          if (type === 'teaching') {
            return { ...u, teachingSkills: [...u.teachingSkills, newSkill] };
          } else {
            return { ...u, learningSkills: [...u.learningSkills, newSkill] };
          }
        }
        return u;
      })
    );
    showToast(`Added "${skill.name}" to your ${type} portfolio!`, 'success');
  };

  const updateSkill = (type: 'teaching' | 'learning', skill: SkillItem) => {
    if (!currentUser) return;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          if (type === 'teaching') {
            return {
              ...u,
              teachingSkills: u.teachingSkills.map((s) => (s.id === skill.id ? skill : s)),
            };
          } else {
            return {
              ...u,
              learningSkills: u.learningSkills.map((s) => (s.id === skill.id ? skill : s)),
            };
          }
        }
        return u;
      })
    );
    showToast(`Updated "${skill.name}" successfully!`, 'success');
  };

  const removeSkill = (type: 'teaching' | 'learning', skillId: string) => {
    if (!currentUser) return;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          if (type === 'teaching') {
            return {
              ...u,
              teachingSkills: u.teachingSkills.filter((s) => s.id !== skillId),
            };
          } else {
            return {
              ...u,
              learningSkills: u.learningSkills.filter((s) => s.id !== skillId),
            };
          }
        }
        return u;
      })
    );
    showToast(`Removed skill from your ${type} portfolio.`, 'info');
  };

  // Goals Management
  const addGoal = (goalData: Omit<LearningGoal, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newGoal: LearningGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(`Created new learning goal: "${newGoal.title}"`, 'success');
  };

  const updateGoal = (updatedGoal: LearningGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    showToast(`Updated goal: "${updatedGoal.title}"`, 'success');
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    showToast('Learning goal deleted.', 'info');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;

        const updatedMilestones = goal.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const nextState = !m.completed;
          return {
            ...m,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString().slice(0, 10) : undefined,
          };
        });

        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const total = updatedMilestones.length;
        const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        const newStatus =
          newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started';

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          status: newStatus,
          completedAt: newStatus === 'Completed' ? new Date().toISOString().slice(0, 10) : undefined,
        };
      })
    );
  };

  // Activities Management
  const addActivity = (activityData: Omit<LearningActivity, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newActivity: LearningActivity = {
      ...activityData,
      id: `act-${Date.now()}`,
      userId: currentUser.id,
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(
      `Logged session: ${newActivity.durationMinutes} mins of ${newActivity.skillName}!`,
      'success'
    );
  };

  const deleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
    showToast('Activity record removed.', 'info');
  };

  // Partnership Requests
  const sendPartnershipRequest = (
    receiverId: string,
    offeredSkill: string,
    requestedSkill: string,
    message: string,
    preferredFormat: LearningFormat
  ) => {
    if (!currentUser) return;
    const target = allUsers.find((u) => u.id === receiverId);
    if (!target) return;

    const newRequest: PartnershipRequest = {
      id: `req-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: target.id,
      senderName: currentUser.name,
      receiverName: target.name,
      senderAvatar: currentUser.avatar,
      receiverAvatar: target.avatar,
      offeredSkill,
      requestedSkill,
      status: 'pending',
      message,
      preferredFormat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    showToast(`Skill exchange invitation sent to ${target.name}!`, 'success');
  };

  const updateRequestStatus = (
    requestId: string,
    status: 'accepted' | 'declined' | 'completed'
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r
      )
    );
    showToast(`Exchange partnership request marked as ${status}!`, 'info');
  };

  const openUserModal = (user: UserProfile) => {
    setSelectedUserForModal(user);
  };

  const closeUserModal = () => {
    setSelectedUserForModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        allUsers,
        goals,
        activities,
        requests,
        achievements,
        activeTab,
        setActiveTab,
        selectedUserForModal,
        openUserModal,
        closeUserModal,
        toasts,
        showToast,
        removeToast,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        addSkill,
        updateSkill,
        removeSkill,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        addActivity,
        deleteActivity,
        sendPartnershipRequest,
        updateRequestStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
