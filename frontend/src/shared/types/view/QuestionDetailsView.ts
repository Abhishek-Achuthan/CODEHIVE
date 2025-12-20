export interface QuestionDetailsView {
  id: string;
  title: string;
  contentHtml: string;

  author: {
    id: string;
    firstName: string;
    avatarUrl?: string;
  };

  tags: string[];

  voteCount: number;
  userVote: 1 | -1 | 0;

  views: number;
  answerCount: number;

  bookmarked: boolean;

  createdAt: string;
  updatedAt?: string;

  version?: number;
}
