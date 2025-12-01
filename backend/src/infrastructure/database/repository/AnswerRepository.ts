import { GenericRepository } from './GenericRepository';
import { AnswerDoc } from '../schemas/qna/AnswerSchema';
import { AnswerEntity } from '../../../domain/entities/qna/AnswerEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { IAnswerRepostiory } from '../../../domain/interfaces/IAnswerRepository';
import AnswerModel from '../models/qna/AnswerModel';
import { Model, SortOrder, Types } from 'mongoose';
import { IAnswerListQueryDTO } from '../../../application/dto/AnswerDTO';
import { AnswerSort } from '../../../domain/types/AnswerSort';

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

  async listByQuestion(
    data: IAnswerListQueryDTO
  ): Promise<PaginationResult<AnswerEntity>> {
    const {
      limit = 10,
      sortBy = AnswerSort.Newest,
      page = 1,
      questionId,
    } = data;

    const question = { questionId: new Types.ObjectId(questionId) };
    const pageLimit = Math.max(1, Math.min(100, limit));
    const currentPage = Math.min(1, page);
    const skip = (currentPage - 1) * pageLimit;

    const sort = this.mapSort(sortBy);

    const [docs, totalItems] = await Promise.all([
      this._model.find(question).sort(sort).skip(skip).limit(pageLimit),
      this._model.countDocuments(question),
    ]);

    const items = docs.map((doc) => this.toEntity(doc as AnswerDoc));
    const totalPages = Math.max(1, Math.ceil(totalItems / pageLimit));

    return { items, totalItems, totalPages };
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
      const doc = await this._model.findByIdAndUpdate(answerId,{isAccepted:true},{new:true}).lean<AnswerDoc | null>();
      return doc ? this.toEntity(doc as AnswerDoc): null;
  }

  private mapSort = (sortBy: AnswerSort): { [key: string]: SortOrder } => {
    switch (sortBy) {
      case AnswerSort.Newest:
        return { createdAt: -1 };
      case AnswerSort.votes:
        return { voteCount: -1 };
      default:
        return { createdAt: -1 };
    }
  };
}
