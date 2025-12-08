export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  avatarUrl?: string;
}
