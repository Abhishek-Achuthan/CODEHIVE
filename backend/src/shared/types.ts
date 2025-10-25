import { Document } from "mongoose";
import { UserEntity } from "../domain/entities/UserEntity";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userRole?: string;
    type?: string;
  }
}

export interface UserDocument extends UserEntity,Document {}
