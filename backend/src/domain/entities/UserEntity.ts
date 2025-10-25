import { UserRole } from "../types/UserRole";

export interface UserEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone:string;
  password: string;
  isBlocked: boolean;
  role: UserRole;
}
