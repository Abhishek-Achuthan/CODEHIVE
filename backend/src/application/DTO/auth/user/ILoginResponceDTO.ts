import { User } from "../../../../domain/entities/user/userEntity";

export interface ILoginResponceDTO {
   accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_mentor: boolean;
    is_admin: boolean;
    is_blocked: boolean;
    points: number;
    slots_used: number;
  };
}
