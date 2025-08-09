import { Document,model,ObjectId } from "mongoose";
import { User } from "../../../../domain/entities/user/userEntity";
import { userSchema } from "../schema/userSchema";

export interface IUserModel extends Omit<User,"id">,Document{
   id:ObjectId
}

export const UserModel = model<User>("user",userSchema);