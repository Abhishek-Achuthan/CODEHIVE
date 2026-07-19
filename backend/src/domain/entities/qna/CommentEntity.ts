export interface CommentEntity {
  id: string;
  answerId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
