
import { Experience } from '../../domain/types/ExperienceType';
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
  experience: Experience[];
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  mentorStatus: 'none' | 'pending' | 'approved';
  mentorAppliedAt?: Date | undefined;

  accessToken: string;
  refreshToken?: string | undefined;
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
  experience?: Experience[] | undefined;
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
}

interface IUserProfileResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  about?: string | undefined;
  skills: string[];
  experience: Experience[];
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  mentorStatus: 'none' | 'pending' | 'approved';
}


export type {
  IUserRegisterInputDTO,
  IUserLoginInputDTO,
  IUserLoginResponseDTO,
  IUserListResponseDTO,
  UpdateUserProfileDTO,
  IUserProfileResponseDTO
};



