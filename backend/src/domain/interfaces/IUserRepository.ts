import { IGenericRepository } from "./IGenericRepository";
import { UserEntity } from "../entities/UserEntity";
import { UserDocument } from "../../shared/types";

export interface IUserRepository
  extends IGenericRepository<UserDocument, UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
