export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WithTimestamps {
  createdAt: string;
  updatedAt?: string;
  lastEditedAt?: string;
}

export interface WithVotes {
  votes: number;
  voteCount: number;
}

export interface WithViews {
  views: number;
}

export interface WithAnswers {
  answerCount: number;
  isAnswered: boolean;
}