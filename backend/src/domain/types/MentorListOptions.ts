import { ListQuery } from './ListQuery';

export interface MentorListOptions
  extends ListQuery<
    {
      primaryExpertise?: string;
      experienceLevel?: string;
      skillsAny?: string[];
      mentorIds?: string[];
    },
    never
  > {}
