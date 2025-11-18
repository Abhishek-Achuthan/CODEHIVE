import { IGenericRepository } from './IGenericRepository';
import { UserEntity } from '../entities/UserEntity';
import { UserRole } from '../types/UserRole';
import { PaginationResult } from '../types/PaginationResult';

export interface IUserRepository
  extends IGenericRepository< UserEntity > {
  findByEmail(email: string): Promise<UserEntity | null>;

  getAllUsers(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<PaginationResult<UserEntity>>;
}
