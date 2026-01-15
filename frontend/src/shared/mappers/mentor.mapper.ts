import type { MentorListItemAPI } from "../types/api/mentor";
import type { MentorListItemView } from "../types/view/MentorListItemView";

export function mapMentorListItemToView(
    mentor: MentorListItemAPI
): MentorListItemView {
    return {
        id: mentor.id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        about: mentor.about,
        skills: mentor.skills,
        experience: mentor.experience,
        avatarUrl: mentor.avatarUrl,
        githubUrl: mentor.githubUrl,
        linkedInUrl: mentor.linkedInUrl,
        websiteUrl: mentor.websiteUrl,
    };
}
