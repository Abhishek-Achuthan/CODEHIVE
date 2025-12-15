import type { 
  BaseEntity, 
  WithTimestamps, 
  WithVotes, 
  WithViews,
  WithAnswers
} from './base.types';
import type { User } from './user';

// Domain enums
export type QuestionStatus = "all" | "answered" | "unanswered";

export type QuestionSort =
  | "newest"
  | "oldest"
  | "most_answered"
  | "least_answered"
  | "most_viewed"
  | "most_voted";

export type AnswerSort = "newest" | "votes" | "oldest";

// Base interfaces
export interface QuestionBase extends 
  BaseEntity, 
  WithVotes, 
  WithViews,
  WithAnswers {
  title: string;
  descriptionHtml: string;
  tags: string[];
}

export interface Question extends QuestionBase {
  askedBy: string; 
  bookmarked?: boolean;
  acceptedAnswerId?: string | null;
  lastEditedBy?: string;
  editCount?: number;
  version?: number;
}

export interface QuestionListItem extends Pick<Question, 
  'id' | 'title' | 'descriptionHtml' | 'tags' | 'votes' | 'views'
> {
  answers: number; 
}

export interface RelatedQuestion extends Pick<Question,
  'id' | 'title' | 'tags' | 'votes' | 'views'
> {
  answerCount: number;
}

export interface AnswerBase extends BaseEntity, WithTimestamps {
  answerText: string;
  isAccepted: boolean;
  voteCount: number;
  version: number;
}

export interface Answer extends AnswerBase {
  author: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
}

export interface AnswerAuthor {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface GetQuestionData {
  author: Partial<User>;
  question: Question;
  isBookmarked: boolean;
}