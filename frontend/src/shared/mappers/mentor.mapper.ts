import type { MentorCardData, MentorListItemAPI } from "../types/api/mentor";

export function mapMentorListItemToView(
    mentor: MentorListItemAPI
): MentorCardData {
    return {
        id: mentor.id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        avatarUrl: mentor.avatarUrl,
        primaryExpertise: mentor.primaryExpertise,
        experienceLevel: mentor.experienceLevel,
    };
}
