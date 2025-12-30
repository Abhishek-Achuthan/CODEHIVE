import type { AdminUserListItemApi } from "../types/api/admin";
import type { UserApi } from "../types/api/auth";
import type { AdminUserListItemView } from "../types/view/AdminUserListItemView";
import type { CurrentUserView } from "../types/view/CurrentUserView";

export function mapAdminUserListItemToView(
  user: AdminUserListItemApi
): AdminUserListItemView {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
  };
}

export function mapCurrentUserToView(user: UserApi): CurrentUserView {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isBlocked: user.isBlocked,
    avatarUrl: user.avatarUrl,
    about: user.about,
    skills: user.skills,
    experience: user.experience,
    githubUrl: user.githubUrl,
    linkedInUrl: user.linkedInUrl,
    websiteUrl: user.websiteUrl,
    mentorStatus: user.mentorStatus,
    mentorAppliedAt: user.mentorAppliedAt,
  };
}
