import { GenericRepository } from './GenericRepository';
import { Model, Types } from 'mongoose';

import SavedListItemModel from '../models/qna/SavedListItemModel';
import { SavedListItemDoc } from '../schemas/qna/SavedListItemSchema';
import { SavedListItemEntity } from '../../../domain/entities/qna/SavedListItemEntity';
import { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';

export class SavedListItemRepository
  extends GenericRepository<SavedListItemDoc, SavedListItemEntity>
  implements ISavedListItemRepository
{
  constructor() {
    super(SavedListItemModel as Model<SavedListItemDoc>);
  }

  async exists(listId: string, questionId: string): Promise<boolean> {
    const doc = await this._model.findOne({
      listId: new Types.ObjectId(listId),
      questionId: new Types.ObjectId(questionId),
    });

    return Boolean(doc);
  }

  async deleteByList(listId: string): Promise<void> {
    await this._model.deleteMany({ listId: new Types.ObjectId(listId) });
  }

  async deleteByQuestion(questionId: string): Promise<void> {
    await this._model.deleteMany({ questionId: new Types.ObjectId(questionId) });
  }

  async deleteByListAndQuestion(listId: string, questionId: string): Promise<void> {
    await this._model.deleteOne({
      listId: new Types.ObjectId(listId),
      questionId: new Types.ObjectId(questionId),
    });
  }

  async findQuestionIdsByList(listId: string): Promise<string[]> {
    const docs = await this._model
      .find({ listId: new Types.ObjectId(listId) })
      .select('questionId')
      .lean<SavedListItemDoc[]>();

    return docs.map((d) => d.questionId.toString());
  }

  async findListIdsByQuestion(
    questionId: string,
    listIds: string[]
  ): Promise<string[]> {
    if (listIds.length === 0) return [];

    const ids = (await this._model.distinct('listId', {
      questionId: new Types.ObjectId(questionId),
      listId: { $in: listIds.map((id) => new Types.ObjectId(id)) },
    })) as Types.ObjectId[];

    return ids.map((id) => id.toString());
  }

  protected toEntity(doc: SavedListItemDoc): SavedListItemEntity {
    return {
      id: doc._id.toString(),
      listId: doc.listId.toString(),
      questionId: doc.questionId.toString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  protected toDocument(data: Partial<SavedListItemEntity>): Partial<SavedListItemDoc> {
    const doc: Partial<SavedListItemDoc> = {};

    if (data.listId !== undefined) doc.listId = new Types.ObjectId(data.listId);
    if (data.questionId !== undefined)
      doc.questionId = new Types.ObjectId(data.questionId);

    return doc;
  }
}
