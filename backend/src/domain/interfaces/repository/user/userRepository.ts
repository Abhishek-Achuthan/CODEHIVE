import type { User } from '../../../entities/user/userEntity'

export interface IUserRepository{
    findByEmail(email:string):Promise<User|null>;
}