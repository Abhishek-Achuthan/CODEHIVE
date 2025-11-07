import { UserRole } from '../types/UserRole';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?:string;
  githubId?:string;
  isBlocked: boolean;
  role: UserRole;
}
