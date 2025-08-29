import { baseUser } from "../baseUser/baseUserEntity";

export interface User extends baseUser {
  password: string;
  points: number;
  slots_used: number;
  is_mentor: boolean;
  is_admin: boolean;
  is_blocked: boolean;
}
