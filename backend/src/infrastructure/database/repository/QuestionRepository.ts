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
import {
  AuthorInfo,
  QuestionWithAuthor,
} from '../../../domain/types/QuestionWithAuthor';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';
import { QuestionLeanDoc } from '../schemas/qna/QuestionSchema';
import { UserLeanDoc } from '../schemas/UserSchema';
import { PopulatedQuestionDoc } from '../types/PopulatedQuestionDoc';

export class QuestionRepository
  extends GenericRepository<QuestionDoc, QuestionEntity>
  implements IQuestionRepository
{
  constructor() {
    super(QuestionModel as Model<QuestionDoc>);
  }

  async findByAuthorId(
    authorId: string
  ): Promise<PaginationResult<QuestionEntity>> {
    const query: FilterQuery<QuestionDoc> = { askedBy: authorId };
    const questionDocs = await this._model
      .find(query)
      .lean<QuestionLeanDoc[]>();
    const questions = questionDocs.map((doc) =>
      this.leanToEntity(doc as QuestionLeanDoc)
    );

    return { items: questions, totalItems: questions.length, totalPages: 1 };
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

    if (search) {
      const raw = search.trim();
      if (raw.length > 0) {
        const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'i');
        query.$or = [{ title: re }, { description: re }];
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

  async incrementAnswerCountAndSetAnswered(
    questionId: string,
    amount: number,
    setAnswered: boolean
  ): Promise<void> {
    const update: UpdateQuery<QuestionDoc> = { $inc: { answerCount: amount } };

    if (setAnswered) {
      update.$set = { isAnswered: true };
    }

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

    const docs = await this._model.find(query).limit(3).lean<QuestionLeanDoc[]>();

    return docs.map((doc) => this.leanToEntity(doc as QuestionLeanDoc));
  }

  async getQuestionWithAuthorData(
    questionId: string
  ): Promise<QuestionWithAuthor | null> {
    const doc = await this._model
      .findById(questionId)
      .populate<{ askedBy: UserLeanDoc }>({
        path: 'askedBy',
        select: 'firstName email lastName',
      })
      .lean<PopulatedQuestionDoc | null>();

    if (!doc) return null;

    const author: AuthorInfo = {
      id: doc.askedBy._id.toString(),
      email: doc.askedBy.email,
      firstName: doc.askedBy.firstName,
      lastName: doc.askedBy.lastName,
    };

    const questionDoc: QuestionLeanDoc = {
      _id: doc._id,
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      isAnswered: doc.isAnswered,
      acceptedAnswerId: doc.acceptedAnswerId,
      answerCount: doc.answerCount,
      askedBy: doc.askedBy._id,
      createdAt: doc.createdAt,
      tags: doc.tags,
      updatedAt: doc.updatedAt,
      views: doc.views,
      votes: doc.votes,
    };

    return {
      question: this.leanToEntity(questionDoc),
      author,
    };
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
      id: doc._id.toString(),
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      askedBy: doc.askedBy.toString(),
      tags: doc.tags,
      answerCount: doc.answerCount,
      votes: doc.votes,
      isAnswered: doc.isAnswered,
      views: doc.views,
      acceptedAnswerId: doc.acceptedAnswerId
        ? doc.acceptedAnswerId.toString()
        : null,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
    };
  }
  
  private leanToEntity(doc:QuestionLeanDoc | PopulatedQuestionDoc):QuestionEntity {
    return {
      id: doc._id.toString(),
      title: doc.title,
      descriptionHtml: doc.descriptionHtml,
      askedBy: doc.askedBy.toString(),
      tags: doc.tags,
      answerCount: doc.answerCount,
      votes: doc.votes,
      isAnswered: doc.isAnswered,
      views: doc.views,
      acceptedAnswerId: doc.acceptedAnswerId
        ? doc.acceptedAnswerId.toString()
        : null,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
      updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
    }
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
