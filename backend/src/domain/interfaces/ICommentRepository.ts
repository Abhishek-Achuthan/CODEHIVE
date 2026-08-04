import { IGenericRepository } from './IGenericRepository';
import { CommentEntity } from '../entities/qna/CommentEntity';

export interface CommentWithAuthor {
  id: string;
  answerId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    reputation: number;
  };
}

export interface ICommentRepository extends IGenericRepository<CommentEntity> {
  listByAnswer(answerId: string): Promise<CommentWithAuthor[]>;
}
