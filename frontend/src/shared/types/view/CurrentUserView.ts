export interface CurrentUserView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  avatarUrl?: string;
}
