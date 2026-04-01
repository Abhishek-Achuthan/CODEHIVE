import type { BaseEntity } from './base.types';
import type { UserRole } from '../../constants/auth';

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  avatarUrl?: string;
}
