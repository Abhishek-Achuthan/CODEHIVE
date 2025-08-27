import type { RegisterUser } from "../../../entities/user/registerUserEntity";
import type { User } from "../../../entities/user/userEntity";

export interface IUserRepository{
    createUser(user:Omit<RegisterUser,"id">):Promise<Boolean>
    findByEmail(email:string):Promise<User|null>;
}