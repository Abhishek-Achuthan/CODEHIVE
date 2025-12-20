import { QuestionViewEntity } from '../entities/qna/QuestionViewEntity';
import { IGenericRepository } from './IGenericRepository';

export interface IQuestionViewRepository
  extends IGenericRepository<QuestionViewEntity>
{
  createIfNotExists(userId: string, questionId: string): Promise<boolean>;
}
