import { UserRole } from '../domain/types/UserRole';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userRole?: string;
    type?: string;
  }
}

declare module 'express-serve-static-core' {
  interface UserPayload {
    id: string;
    role: UserRole;
  }

  interface Request {
    user?: UserPayload;
  }
}


