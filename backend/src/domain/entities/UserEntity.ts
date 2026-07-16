import { UserRole } from '../types/UserRole';
import { Experience } from '../types/ExperienceType';
import { MentorStatus } from '../types/MentorStatus';
import { UserLanguage } from '../types/UserLanguage';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  about?: string;
  skills: string[];
  languages?: UserLanguage[];
  experience: Experience[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string
  phone?: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  primaryExpertise?: string;
  experienceLevel?: string;
  isBlocked: boolean;
  mentorAppliedAt?: Date;
  mentorStatus: MentorStatus;
  role: UserRole;

  planId?: string | null;

  banExpirationDate?: Date | null;
  banReason?: string | null;
  bannedAt?: Date | null;
  bannedBy?: string | null;
  warnCount: number;
}
