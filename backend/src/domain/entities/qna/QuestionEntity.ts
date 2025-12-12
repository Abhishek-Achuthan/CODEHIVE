export interface QuestionEntity {
  id: string;
  title: string;
  descriptionHtml: string;
  askedBy: string;
  answerCount: number;
  isAnswered: boolean;
  tags: string[];
  views: number;
  votes: number;
  lastEditedAt?:string
  lastEditedBy?:string |  null;
  editCount:number;
  version:number;
  acceptedAnswerId:string | null;
  createdAt: string 
  updatedAt: string | null;
}
