import { ListQuery } from './ListQuery';

export type MentorListOptions = ListQuery<
  {
    primaryExpertise?: string;
    experienceLevel?: string;
    skillsAny?: string[];
    mentorIds?: string[];
  },
  never
>;
