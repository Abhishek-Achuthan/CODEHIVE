import { baseUser } from "../baseUser/baseUserEntity";

export interface User extends baseUser {
   password : string,
   points : number,
   slots_used : number
}