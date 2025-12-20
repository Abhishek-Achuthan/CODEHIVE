import { GenericRepository } from './GenericRepository';
import { Model, Types } from 'mongoose';

import SavedListModel from '../models/qna/SavedListModel';
import { SavedListDoc } from '../schemas/qna/SavedListSchema';
import { SavedListEntity } from '../../../domain/entities/qna/SavedListEntity';
import { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';

export class SavedListRepository
  extends GenericRepository<SavedListDoc, SavedListEntity>
  implements ISavedListRepository
{
  constructor() {
    super(SavedListModel as Model<SavedListDoc>);
  }

  async listByUser(userId: string): Promise<SavedListEntity[]> {
    const docs = await this._model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean<SavedListDoc[]>();

    return docs.map((d) => this.toEntity(d as SavedListDoc));
  }

  async findByUserAndName(userId: string, name: string): Promise<SavedListEntity | null> {
    const doc = await this._model
      .findOne({ userId: new Types.ObjectId(userId), name })
      .lean<SavedListDoc | null>();

    return doc ? this.toEntity(doc as SavedListDoc) : null;
  }

  protected toEntity(doc: SavedListDoc): SavedListEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  protected toDocument(data: Partial<SavedListEntity>): Partial<SavedListDoc> {
    const doc: Partial<SavedListDoc> = {};

    if (data.userId !== undefined) doc.userId = new Types.ObjectId(data.userId);
    if (data.name !== undefined) doc.name = data.name;

    return doc;
  }
}
