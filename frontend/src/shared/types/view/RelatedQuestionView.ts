export interface RelatedQuestionView {
  id: string;
  title: string;
  tags: string[];

  voteCount: number;
  answerCount: number;
  views: number;
}
