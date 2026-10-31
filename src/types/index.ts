export type SkillCategory =
  | 'Programming'
  | 'Design'
  | 'Communication'
  | 'Writing'
  | 'Media'
  | 'Business'
  | 'Other';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type LearningFormat =
  | '1-on-1 Video'
  | 'Async Feedback & Review'
  | 'Hands-on Pairing'
  | 'Chat & Resource Sharing'
  | 'Group Workshop';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  description: string;
  availabilityNotes: string;
  yearsExperience?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  headline: string;
  avatar: string;
  bio: string;
  role: string;
  institution: string;
  location: string;
  preferredFormats: LearningFormat[];
  availabilityHoursPerWeek: number;
  availabilitySchedule: string;
  teachingSkills: SkillItem[];
  learningSkills: SkillItem[];
  interests: string[];
  streakDays: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
}

export interface LearningGoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  skillName: string;
  category: SkillCategory;
  description: string;
  targetDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number; // 0 - 100
  milestones: LearningGoalMilestone[];
  createdAt: string;
  completedAt?: string;
}

export type ActivityType =
  | '1-on-1 Mentoring'
  | 'Mutual Skill Swap'
  | 'Pair Programming / Co-working'
  | 'Feedback & Review'
  | 'Independent Study & Practice'
  | 'Group Workshop';

export interface LearningActivity {
  id: string;
  userId: string;
  date: string;
  skillName: string;
  category: SkillCategory;
  activityType: ActivityType;
  durationMinutes: number;
  partnerId?: string;
  partnerName?: string;
  notes: string;
  keyTakeaways: string[];
  isTeaching: boolean; // true = taught, false = learned
}

export interface PartnershipRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  senderAvatar: string;
  receiverAvatar: string;
  offeredSkill: string;
  requestedSkill: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  preferredFormat: LearningFormat;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface SkillMatch {
  partner: UserProfile;
  matchType: 'mutual' | 'mentor' | 'peer-learner';
  matchScore: number;
  teachSkillsMatched: string[]; // skills partner can teach current user
  learnSkillsMatched: string[]; // skills current user can teach partner
  reason: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'discover'
  | 'matches'
  | 'my-skills'
  | 'goals'
  | 'activity'
  | 'partnerships'
  | 'achievements'
  | 'analytics'
  | 'profile';
