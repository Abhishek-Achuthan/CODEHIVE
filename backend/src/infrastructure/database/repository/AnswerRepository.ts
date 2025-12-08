import { GenericRepository } from './GenericRepository';
import { AnswerDoc, AnswerLeanDoc } from '../schemas/qna/AnswerSchema';
import { AnswerEntity } from '../../../domain/entities/qna/AnswerEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { IAnswerRepostiory } from '../../../domain/interfaces/IAnswerRepository';
import AnswerModel from '../models/qna/AnswerModel';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { AnswerSort } from '../../../domain/types/AnswerSort';
import { AnswerWithAuthor } from '../../../domain/types/AnswerWithAuthor';
import { AuthorInfo } from '../../../domain/types/AuthorInfo';
import { UserLeanDoc } from '../schemas/UserSchema';
import { PopulatedAnswerDoc } from '../types/PopulatedAnswerDoc';
import { AnswerListQuery } from '../../../domain/types/AnswerListQuery';

export class AnswerRepository
  extends GenericRepository<AnswerDoc, AnswerEntity>
  implements IAnswerRepostiory
{
  constructor() {
    super(AnswerModel as Model<AnswerDoc>);
  }

  protected toDocument(data: Partial<AnswerEntity>): Partial<AnswerDoc> {
    const doc: Partial<AnswerDoc> = {};
    if (data.questionId !== undefined)
      doc.questionId = new Types.ObjectId(data.questionId);
    if (data.answeredBy !== undefined)
      doc.answeredBy = new Types.ObjectId(data.answeredBy);
    if (data.answerText !== undefined) doc.answerText = data.answerText;
    if (data.isAccepted !== undefined) doc.isAccepted = data.isAccepted;
    if (data.voteCount !== undefined) doc.voteCount = data.voteCount;
    return doc;
  }

  protected toEntity(doc: AnswerDoc): AnswerEntity {
    return {
      id: doc._id.toString(),
      questionId: doc.questionId.toString(),
      answeredBy: doc.answeredBy.toString(),
      answerText: doc.answerText,
      isAccepted: doc.isAccepted,
      voteCount: doc.voteCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private leanToEntity(doc: AnswerLeanDoc): AnswerEntity {
    return {
      id: doc._id.toString(),
      questionId: doc.questionId.toString(),
      answeredBy: doc.answeredBy.toString(),
      answerText: doc.answerText,
      isAccepted: doc.isAccepted,
      voteCount: doc.voteCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async listByQuestion(
    questionId: string,
    query: AnswerListQuery
  ): Promise<PaginationResult<AnswerWithAuthor>> {
    const { limit = 10, sortBy = AnswerSort.Newest, page = 1, search } = query || {};

    const id = new Types.ObjectId(questionId);
    
    const answerQuery : FilterQuery<AnswerDoc> = {};

    answerQuery.questionId = id;

    const currentPage = Math.max(1,page);
    
    const sort = this.mapSort(sortBy);

    const pageLimit = Math.min(100, limit);
    
    const skip = (currentPage-1) * pageLimit;
    
    if(search) {
      const raw = search.trim();

      if(raw.length >0) {
        const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'i');
         answerQuery.answerText = re;
      }
    }

    const doc = await this._model
      .find(answerQuery)
      .populate<{ userId: UserLeanDoc }>({
        path: 'userId',
        select: 'email firstName lastName',
      }).sort(sort).skip(skip).limit(pageLimit)
      .lean<PopulatedAnswerDoc[] | null>();

    if (!doc || doc.length === 0) {
      return {
        items : [],
        totalItems: 0,
        totalPages:0,
      }
    };

    const totalItems = await this._model.countDocuments(answerQuery);

    const totalPages = Math.ceil(totalItems/pageLimit);

    const items: AnswerWithAuthor[] = doc?.map((doc) => {
      const author: AuthorInfo = {
        id: doc.userId._id.toString(),
        email: doc.userId.email,
        firstName: doc.userId.firstName,
        lastName: doc.userId.lastName,
      };

      const answerEntity: AnswerEntity = this.leanToEntity(doc);

      return {
        answer: answerEntity,
        author,
      };
    });

    return {
      items,
      totalItems,
      totalPages,
    };
  }
  async incrementVoteCount(answerId: string): Promise<number> {
    const updated = await this._model
      .findByIdAndUpdate(
        answerId,
        { $inc: { voteCount: 1 } },
        { new: true, select: 'voteCount' }
      )
      .lean<AnswerDoc | null>();
    return updated ? (updated.voteCount as number) : 0;
  }

  async setAccepted(answerId: string): Promise<AnswerEntity | null> {
    const doc = await this._model
      .findByIdAndUpdate(answerId, { isAccepted: true }, { new: true })
      .lean<AnswerDoc | null>();
    return doc ? this.toEntity(doc as AnswerDoc) : null;
  }

  private mapSort = (sortBy: AnswerSort): { [key: string]: SortOrder } => {
    switch (sortBy) {
      case AnswerSort.Newest:
        return { createdAt: -1 };
      case AnswerSort.votes:
        return { voteCount: -1 };
      case AnswerSort.Oldest:
        return { createdAt: 1 };
      default:
        return { createdAt: -1 };
    }
  };
}
