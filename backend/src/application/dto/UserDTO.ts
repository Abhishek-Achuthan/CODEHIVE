
import { Experience } from '../../domain/types/ExperienceType';
import { MentorStatus } from '../../domain/types/MentorStatus';
import { UserLanguage } from '../../domain/types/UserLanguage';
interface IUserRegisterInputDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface IUserLoginInputDTO {
  email: string;
  password: string;
}

interface IUserLoginResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  phone?: string | undefined;
  about?: string | undefined;
  skills: string[];
  languages: UserLanguage[];
  experience: Experience[];
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  mentorStatus: MentorStatus;
  mentorAppliedAt?: Date | undefined;
  primaryExpertise?: string | undefined;
  experienceLevel?: string | undefined;

  accessToken: string;
  refreshToken?: string | undefined;
  hasPassword: boolean;
}

interface IUserListResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | undefined;
  role: string;
  isBlocked: boolean;
}

interface UpdateUserProfileDTO {
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  about?: string | undefined;
  skills?: string[] | undefined;
  languages?: UserLanguage[] | undefined;
  experience?: Experience[] | undefined;
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  primaryExpertise?: string | undefined;
  experienceLevel?: string | undefined;
}

interface IUserProfileResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  about?: string | undefined;
  skills: string[];
  languages: UserLanguage[];
  experience: Experience[];
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  mentorStatus: MentorStatus;
  primaryExpertise?: string | undefined;
  experienceLevel?: string | undefined;
  hasPassword: boolean;
}

interface IUserActivityStatsDTO {
  totalSessionsTaken: number;
  joinedRooms: number;
  qnaContributions: number;
}


export type {
  IUserRegisterInputDTO,
  IUserLoginInputDTO,
  IUserLoginResponseDTO,
  IUserListResponseDTO,
  UpdateUserProfileDTO,
  IUserProfileResponseDTO,
  IUserActivityStatsDTO
};



