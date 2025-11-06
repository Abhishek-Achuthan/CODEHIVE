import { IGenericRepository } from "./IGenericRepository";
import { UserEntity } from "../entities/UserEntity";
import { UserDocument } from "../../shared/types";
import { UserRole } from "../types/UserRole";

export interface IUserRepository
  extends IGenericRepository<UserDocument, UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;

  getAllUsers(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<{users:UserEntity[];totalItems:number;totalPages:number}>;
}
