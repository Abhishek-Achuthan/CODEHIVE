import { Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import QuestionViewModel from '../models/qna/QuestionViewModel';
import { QuestionViewDoc } from '../schemas/qna/QuestionViewSchema';
import { QuestionViewEntity } from '../../../domain/entities/qna/QuestionViewEntity';
import { IQuestionViewRepository } from '../../../domain/interfaces/IQuestionViewRepository';

export class QuestionViewRepository
  extends GenericRepository<QuestionViewDoc, QuestionViewEntity>
  implements IQuestionViewRepository
{
  constructor() {
    super(QuestionViewModel as Model<QuestionViewDoc>);
  }

  async createIfNotExists(userId: string, questionId: string): Promise<boolean> {
    try {
      await this._model.create({
        userId: new Types.ObjectId(userId),
        questionId: new Types.ObjectId(questionId),
      });
      return true;
    } catch (error: unknown) {
      const anyErr = error as { code?: number };
      if (anyErr?.code === 11000) return false;
      throw error;
    }
  }

  protected toEntity(doc: QuestionViewDoc): QuestionViewEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      questionId: doc.questionId.toString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  protected toDocument(data: Partial<QuestionViewEntity>): Partial<QuestionViewDoc> {
    const doc: Partial<QuestionViewDoc> = {};

    if (data.userId !== undefined) doc.userId = new Types.ObjectId(data.userId);
    if (data.questionId !== undefined)
      doc.questionId = new Types.ObjectId(data.questionId);

    return doc;
  }
}
