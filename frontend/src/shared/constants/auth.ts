export const UserRole = {
  USER: "user",
  MENTOR: "mentor",
  ADMIN: "admin",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const MentorStatus = {
  NONE: "none",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type MentorStatus = typeof MentorStatus[keyof typeof MentorStatus];
