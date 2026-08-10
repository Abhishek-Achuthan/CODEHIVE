export interface AnswerView {
  id: string;
  contentHtml: string;

  author: {
    id: string;
    firstName: string;
    avatarUrl?: string;
  };

  voteCount: number;
  isAccepted: boolean;

  createdAt: string;
  updatedAt?: string;
  version?: number;
}
