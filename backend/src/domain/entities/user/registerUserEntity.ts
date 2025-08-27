import { baseUser } from "../baseUser/baseUserEntity";

export interface RegisterUser extends baseUser{
    password : string;
}