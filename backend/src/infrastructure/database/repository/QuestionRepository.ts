import { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { GenericRepository } from './GenericRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import QuestionModel from '../models/qna/QuestionModel';
import { QuestionDoc } from '../schemas/qna/QuestionSchema';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionStatus } from '../../../domain/types/QuestionStatus';
import { QuestionSort } from '../../../domain/types/QuestionSort';
import { UpdateQuery } from 'mongoose';
import { QuestionWithAuthor } from '../../../domain/types/QuestionWithAuthor';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';
import { QuestionLeanDoc } from '../schemas/qna/QuestionSchema';
import { UserLeanDoc } from '../schemas/UserSchema';
import { PopulatedQuestionDoc } from '../types/PopulatedQuestionDoc';
import { AuthorInfo } from '../../../domain/types/AuthorInfo';
import { QuestionEditableFields } from '../../../domain/types/QuestionEditableFields';

export class QuestionRepository
  extends GenericRepository<QuestionDoc, QuestionEntity>
  implements IQuestionRepository
{
  constructor() {
    super(QuestionModel as Model<QuestionDoc>);
  }

  async list(
    data: QuestionListQuery
  ): Promise<PaginationResult<QuestionEntity>> {
    const { filter, limit = 10, page = 1, sortBy, search } = data || {};

    const query: FilterQuery<QuestionDoc> = {};

    const tags: string[] = [];
    if (filter?.tags?.length) tags.push(...filter.tags);
    if (tags.length) query.tags = { $in: tags };

    if (filter?.status === QuestionStatus.ANSWERED) query.isAnswered = true;
    if (filter?.status === QuestionStatus.UNANSWERED) query.isAnswered = false;

    if (filter?.dateFrom) {
      query.createdAt = {};
      if (filter.dateFrom) query.createdAt.$gte = new Date(filter.dateFrom);
    }

    if (filter?.minAnswers !== undefined)
      query.answerCount = { $gte: filter?.minAnswers };
    if (filter?.minVotes !== undefined)
      query.votes = { $gte: filter?.minVotes };

    if (filter?.askedBy) {
      query.askedBy = filter.askedBy;
    }

    if (search) {
      const raw = search.trim();
      if (raw.length > 0) {
        const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'i');
        query.$or = [{ title: re }, { descriptionHtml: re }];
      }
    }

    const sort = this.mapSort(sortBy);

    const pageLimit = Math.max(1, Math.min(100, limit));
    const currentPage = Math.max(1, page);
    const skip = (currentPage - 1) * limit;

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageLimit)
        .lean<QuestionLeanDoc[]>(),
      this._model.countDocuments(query),
    ]);


    const items = docs.map((d) => this.leanToEntity(d as QuestionLeanDoc));
    const totalPages = limit 
      ? Math.max(1, Math.ceil(totalItems / pageLimit))
      : 1;

    return { items, totalItems, totalPages };
  }

  async listByIds(
    questionIds: string[],
    data: QuestionListQuery
  ): Promise<PaginationResult<QuestionEntity>> {
    if (questionIds.length === 0) {
      return { items: [], totalItems: 0, totalPages: 0 };
    }

    const { filter, search, sortBy, page = 1, limit = 10 } = data || {};

    const query: FilterQuery<QuestionDoc> = {
      _id: { $in: questionIds.map((id) => new Types.ObjectId(id)) },
    };

    const tags: string[] = [];
    if (filter?.tags?.length) tags.push(...filter.tags);
    if (tags.length) query.tags = { $in: tags };

    if (filter?.status === QuestionStatus.ANSWERED) query.isAnswered = true;
    if (filter?.status === QuestionStatus.UNANSWERED) query.isAnswered = false;

    if (filter?.dateFrom) {
      query.createdAt = {};
      query.createdAt.$gte = new Date(filter.dateFrom);
    }

    if (search) {
      const raw = search.trim();
      if (raw.length > 0) {
        const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'i');
        query.$or = [{ title: re }, { descriptionHtml: re }];
      }
    }

    const sort = this.mapSort(sortBy);

    const currentPage = Math.max(1, page);
    const pageLimit = Math.min(100, Math.max(1, limit));
    const skip = (currentPage - 1) * pageLimit;

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageLimit)
        .lean<QuestionLeanDoc[]>(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((d) => this.leanToEntity(d as QuestionLeanDoc));
    const totalPages = Math.max(1, Math.ceil(totalItems / pageLimit));

    return { items, totalItems, totalPages };
  }

  async setIsAnswered(questionId: string, isAnswered: boolean): Promise<void> {
    await this._model.updateOne({ _id: questionId }, { $set: { isAnswered } });
  }

  async incrementAnswerCount(
    questionId: string,
    amount: number
  ): Promise<void> {
    await this._model.updateOne(
      { _id: questionId },
      { $inc: { answerCount: amount } }
    );
  }

  async incrementViews(questionId: string, amount: number): Promise<void> {
    await this._model.updateOne(
      { _id: questionId },
      { $inc: { views: amount } }
    );
  }

  async incrementVotes(questionId: string, amount: number): Promise<number> {
    const updated = await this._model
      .findByIdAndUpdate(
        questionId,
        { $inc: { votes: amount } },
        { new: true, select: 'votes' }
      )
      .lean<QuestionDoc | null>();

    return updated ? (updated.votes as number) : 0;
  }

  async listAnsweredByUser(
    questionIds: string[],
    data: QuestionListQuery
  ): Promise<PaginationResult<QuestionEntity>> {

    if (questionIds.length === 0) {
      return { items: [], totalItems: 0, totalPages: 0 };
    }

    const { filter, search, sortBy, page = 1, limit = 10 } = data;

    const query: FilterQuery<QuestionDoc> = {
      _id: { $in: questionIds.map((id) => new Types.ObjectId(id)) },
    };

    if (filter?.tags?.length) query.tags = { $in: filter.tags };

    if (search) {
      const raw = search.trim();
      if (raw.length > 0) {
        const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'i');
        query.$or = [{ title: re }, { descriptionHtml: re }];
      }
    }

    const sort = this.mapSort(sortBy);

    const currentPage = Math.max(1, page);

    const pageLimit = Math.min(100, limit);

    const skip = (currentPage - 1) * pageLimit;

   const [doc,totalItems] = await Promise.all([
    this._model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(pageLimit)
    .lean<QuestionLeanDoc[]>(),

    this._model.countDocuments(query)
   ]);

   const items = doc.map(doc => this.leanToEntity(doc));

   const totalPages = Math.max(1,Math.ceil(totalItems/pageLimit));

   return {
    items,
    totalItems,
    totalPages
   }
  }

  async incrementAnswerCountAndSetAnswered(
    questionId: string,
    amount: number
  ): Promise<void> {
    const update: UpdateQuery<QuestionDoc> = {
      $inc: { answerCount: amount },
      $set: { isAnswered: true },
    };

    await this._model.updateOne({ _id: questionId }, update);
  }

  async getQuestionById(questionId: string): Promise<QuestionEntity | null> {
    const question = await this._model.findById(questionId);

    if (!question) return null;

    return this.toEntity(question as QuestionDoc);
  }

  async relatedQuestions(questionId: string): Promise<QuestionEntity[]> {
    const question = await this._model.findById(questionId);

    if (!question) return [];

    const tags = question.tags || [];

    if (tags.length === 0) return [];

    const query: FilterQuery<QuestionDoc> = {
      _id: { $ne: question._id },
      tags: { $in: tags },
    };

    const docs = await this._model
      .find(query)
      .limit(3)
      .lean<QuestionLeanDoc[]>();

    return docs.map((doc) => this.leanToEntity(doc as QuestionLeanDoc));
  }

  async getQuestionWithAuthorData(
    questionId: string
  ): Promise<QuestionWithAuthor | null> {
    const doc = await this._model
      .findById(questionId)
      .populate<{ askedBy: UserLeanDoc | null }>({
        path: 'askedBy',
        select: 'firstName email lastName _id',
      })
      .lean<PopulatedQuestionDoc | null>();
      
    if (!doc) return null;

    const author: AuthorInfo = doc.askedBy
      ? {
          id: doc.askedBy._id ? doc.askedBy._id.toString() : '',
          email: doc.askedBy.email || '',
          firstName: doc.askedBy.firstName || 'Deleted',
          lastName: doc.askedBy.lastName || 'User',
        }
      : {
          id: '',
          email: '',
          firstName: 'Deleted',
          lastName: 'User',
        };

    const questionDoc: QuestionLeanDoc = {
      _id: doc._id,
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      isAnswered: doc.isAnswered,
      acceptedAnswerId: doc.acceptedAnswerId,
      answerCount: doc.answerCount,
      askedBy: doc.askedBy ? (doc.askedBy._id || doc.askedBy) : (null as any),
      createdAt: doc.createdAt,
      tags: doc.tags,
      updatedAt: doc.updatedAt,
      views: doc.views,
      votes: doc.votes,
      editCount: doc.editCount,
      lastEditedAt: doc.lastEditedAt,
      lastEditedBy: doc.lastEditedBy,
      version: doc.version,
    };

    return {
      question: this.leanToEntity(questionDoc),
      author,
    };
  }

  async updateWithVersion(
    questionId: string,
    expectedVersion: number,
    payload: QuestionEditableFields
  ): Promise<QuestionEntity | null> {
    const p = payload;

    const updateQuery: UpdateQuery<QuestionDoc> = {
      ...(p.title !== undefined && { title: p.title }),
      ...(p.descriptionHtml !== undefined && {
        descriptionHtml: p.descriptionHtml,
      }),
      ...(p.tags !== undefined && { tags: p.tags }),
      lastEditedAt: new Date(),
      lastEditedBy: p.lastEditedBy
        ? new Types.ObjectId(p.lastEditedBy)
        : undefined,

      $inc: {
        editCount: 1,
        version: 1,
      },
    };
    const updatedQues = await this._model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(questionId), version: expectedVersion },
        updateQuery,
        { new: true }
      )
      .lean<QuestionLeanDoc | null>();

    return updatedQues ? this.leanToEntity(updatedQues) : null;
  }

  protected toDocument(data: Partial<QuestionEntity>): Partial<QuestionDoc> {
    const {
      title,
      descriptionHtml,
      askedBy,
      tags,
      answerCount,
      votes,
      isAnswered,
      views,
      acceptedAnswerId,
    } = data;
    const doc: Partial<QuestionDoc> = {};
    if (title !== undefined) doc.title = title;
    if (descriptionHtml !== undefined) doc.descriptionHtml = descriptionHtml;
    if (askedBy !== undefined) doc.askedBy = new Types.ObjectId(askedBy);
    if (tags !== undefined) doc.tags = tags;
    if (answerCount !== undefined) doc.answerCount = answerCount;
    if (votes !== undefined) doc.votes = votes;
    if (isAnswered !== undefined) doc.isAnswered = isAnswered;
    if (views !== undefined) doc.views = views;
    if (acceptedAnswerId !== undefined) {
      doc.acceptedAnswerId = acceptedAnswerId
        ? new Types.ObjectId(acceptedAnswerId)
        : null;
    }
    return doc;
  }

  protected toEntity(doc: QuestionDoc): QuestionEntity {
    return {
      id: doc._id ? doc._id.toString() : '',
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      askedBy: doc.askedBy ? doc.askedBy.toString() : '',
      tags: doc.tags,
      answerCount: doc.answerCount,
      votes: doc.votes,
      isAnswered: doc.isAnswered,
      editCount: doc.editCount,
      version: doc.version,
      views: doc.views,
      acceptedAnswerId: doc.acceptedAnswerId
        ? doc.acceptedAnswerId.toString()
        : null,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
      ...(doc.lastEditedAt
        ? { lastEditedAt: doc.lastEditedAt.toISOString() }
        : {}),
      ...(doc.lastEditedBy
        ? { lastEditedBy: doc.lastEditedBy.toString() }
        : {}),
    };
  }

  private leanToEntity(
    doc: QuestionLeanDoc | PopulatedQuestionDoc
  ): QuestionEntity {
    let askedByStr = '';
    if (doc.askedBy) {
      if (typeof doc.askedBy === 'object' && '_id' in doc.askedBy && doc.askedBy._id) {
        askedByStr = doc.askedBy._id.toString();
      } else if (typeof doc.askedBy.toString === 'function') {
        askedByStr = doc.askedBy.toString();
      }
    }

    return {
      id: doc._id ? doc._id.toString() : '',
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      askedBy: askedByStr,
      tags: doc.tags,
      answerCount: doc.answerCount,
      votes: doc.votes,
      isAnswered: doc.isAnswered,
      views: doc.views,
      editCount: doc.editCount,
      acceptedAnswerId: doc.acceptedAnswerId
        ? doc.acceptedAnswerId.toString()
        : null,
      createdAt: doc.createdAt ? (typeof doc.createdAt === 'string' ? doc.createdAt : doc.createdAt.toISOString()) : new Date().toISOString(),
      version: doc.version,
      updatedAt: doc.updatedAt ? (typeof doc.updatedAt === 'string' ? doc.updatedAt : doc.updatedAt.toISOString()) : null,
      ...(doc.lastEditedAt
        ? { lastEditedAt: typeof doc.lastEditedAt === 'string' ? doc.lastEditedAt : doc.lastEditedAt.toISOString() }
        : {}),
      ...(doc.lastEditedBy
        ? { lastEditedBy: doc.lastEditedBy.toString() }
        : {}),
    };
  }

  private mapSort(sortBy?: QuestionSort): { [key: string]: SortOrder } {
    switch (sortBy) {
      case QuestionSort.MostAnswered:
        return { answerCount: -1 };
      case QuestionSort.LeastAnswered:
        return { answerCount: 1 };
      case QuestionSort.Oldest:
        return { createdAt: 1 };
      case QuestionSort.Newest:
        return { createdAt: -1 };
      case QuestionSort.MostVoted:
        return { votes: -1 };
      case QuestionSort.MostViewed:
        return { views: -1 };
      default:
        return { createdAt: -1 };
    }
  }
}
