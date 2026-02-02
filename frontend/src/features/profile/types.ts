export type ProfileEditSection = "about" | "experience" | "skills" | "avatar" | null;

export type ExperienceType =
  | "job"
  | "freelance"
  | "open_source"
  | "teaching"
  | "self_learning";

export interface ProfileUser {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleTitle: string;
  company: string;
  location: string;
  avatarUrl: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
}

export interface AboutData {
  text: string;
}

export interface ExperienceItem {
  id: string;
  type: ExperienceType;
  title: string;
  organization: string;
  dateRangeLabel: string;
}

export interface ExperienceDraftItem {
  id: string;
  type: ExperienceType;
  title: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface SkillsData {
  skills: string[];
  inputValue: string;
}

export const MentorStatus = {
  NONE: 'none',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type MentorStatus = typeof MentorStatus[keyof typeof MentorStatus];

export interface MentorChecklist {
  aboutComplete: boolean;
  experienceComplete: boolean;
  skillsComplete: boolean;
}

export interface MentorApplicationState {
  checklist: MentorChecklist;
  status: MentorStatus;
  rejectionReason?: string;
  appliedAt?: string;
}
