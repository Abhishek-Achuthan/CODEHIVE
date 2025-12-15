import type { BaseEntity } from './base.types';

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  avatarUrl?: string;
}
