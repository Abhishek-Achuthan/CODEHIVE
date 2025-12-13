type UserRole = import('../../domain/types/UserRole').UserRole;

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};

