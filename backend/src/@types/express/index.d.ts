type UserRole = import('../../domain/types/UserRole').UserRole;
type MentorStatus = import('../../domain/types/MentorStatus').MentorStatus;

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
        mentorStatus: MentorStatus;
      };
    }
  }
}

export {};
