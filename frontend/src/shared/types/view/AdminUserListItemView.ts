export interface AdminUserListItemView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  banExpirationDate?: string | null;
  banReason?: string | null;
  bannedAt?: string | null;
  warnCount: number;
}
