import { UserRole } from '../types/UserRole';
import { Experience } from '../types/ExperienceType';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  about?:string;
  skills:string[];
  experience: Experience[];
  avatarUrl?:string;
  githubUrl?:string;
  linkedInUrl?:string;
  websiteUrl?:string
  phone?: string;
  password?: string;
  googleId?:string;
  githubId?:string;
  primaryExpertise?:string;
  experienceLevel?:string;
  isBlocked: boolean;
  mentorAppliedAt?:Date;
  mentorStatus:'none' | 'pending' | 'approved';
  role: UserRole;
}
