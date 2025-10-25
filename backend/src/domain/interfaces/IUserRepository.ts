import { IGenericRepository } from "./IGenericRepository";
import { UserEntity } from "../entities/UserEntity";

export interface IUserRepository extends IGenericRepository<UserEntity> {
    findByEmail(email:string):Promise<UserEntity | null>;
}