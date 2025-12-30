import { UserEntity } from '../../domain/entities/UserEntity';
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

interface IUserLoginResponseDTO extends Omit<UserEntity, 'password'> {
  accessToken: string;
  refreshToken?: string;
}

interface IUserListResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt?: Date;
}

interface UpdateUserProfileDTO {
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
  about?: string;
  skills: string[];
  experience: Experience[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
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



