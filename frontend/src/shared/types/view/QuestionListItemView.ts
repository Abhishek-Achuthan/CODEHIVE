export interface QuestionListItemView {
  id: string;
  title: string;
  contentHtml: string;
  tags: string[];

  voteCount: number;
  answerCount: number;
  views: number;
}
