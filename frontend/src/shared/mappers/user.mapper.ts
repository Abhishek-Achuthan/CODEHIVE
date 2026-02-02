import type { AdminUserListItemApi, MentorApplicationApi } from "../types/api/admin";
import type { UserApi } from "../types/api/auth";
import type { AdminUserListItemView } from "../types/view/AdminUserListItemView";
import type { CurrentUserView } from "../types/view/CurrentUserView";
import type { MentorApplicationView } from "../types/view/MentorApplicationView";

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

export function mapMentorApplicationToView(
  application: MentorApplicationApi
): MentorApplicationView {
  return {
    id: application.id,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    mentorStatus: application.mentorStatus,
    mentorAppliedAt: new Date(application.mentorAppliedAt),
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
