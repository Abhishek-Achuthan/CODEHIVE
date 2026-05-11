import { UserRole } from '../types/UserRole';
import { Experience } from '../types/ExperienceType';
import { MentorStatus } from '../types/MentorStatus';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  about?: string;
  skills: string[];
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

  /**
   * Reference to the active subscription Plan.
   * Null/undefined means no paid plan (default/free tier rules apply).
   */
  planId?: string | null;
}
