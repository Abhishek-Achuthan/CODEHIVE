import { UserEntity } from '../../domain/entities/UserEntity';
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
  accessToken?: string;
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

export type {
  IUserRegisterInputDTO,
  IUserLoginInputDTO,
  IUserLoginResponseDTO,
  IUserListResponseDTO,
};
