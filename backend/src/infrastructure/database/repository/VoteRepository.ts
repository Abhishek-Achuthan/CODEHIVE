import { Model, Types } from 'mongoose';

import VoteModel from '../models/qna/VoteModel';
import { VoteDoc } from '../schemas/qna/VoteSchema';
import { GenericRepository } from './GenericRepository';
import { VoteEntity } from '../../../domain/entities/qna/VoteEntity';
import { IVoteRepository } from '../../../domain/interfaces/IVoteRepository';
import { VoteTargetType } from '../../../domain/types/VoteTargetType';
import { VoteValue } from '../../../domain/types/VoteValue';

export class VoteRepository
  extends GenericRepository<VoteDoc, VoteEntity>
  implements IVoteRepository
{
  constructor() {
    super(VoteModel as Model<VoteDoc>);
  }

  async findByUserAndTarget(
    userId: string,
    targetId: string,
    targetType: VoteTargetType
  ): Promise<VoteEntity | null> {
    const doc = await this._model.findOne({
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(targetId),
      targetType,
    });

    return doc ? this.toEntity(doc as VoteDoc) : null;
  }

  async deleteByTarget(targetId: string, targetType: VoteTargetType): Promise<void> {
    await this._model.deleteMany({
      targetId: new Types.ObjectId(targetId),
      targetType,
    });
  }

  async deleteByTargetIds(targetIds: string[], targetType: VoteTargetType): Promise<void> {
    if (targetIds.length === 0) return;

    await this._model.deleteMany({
      targetId: { $in: targetIds.map((id) => new Types.ObjectId(id)) },
      targetType,
    });
  }

  protected toEntity(doc: VoteDoc): VoteEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      targetId: doc.targetId.toString(),
      targetType: doc.targetType,
      value: doc.value as VoteValue,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(data: Partial<VoteEntity>): Partial<VoteDoc> {
    const doc: Partial<VoteDoc> = {};

    if (data.userId !== undefined) doc.userId = new Types.ObjectId(data.userId);
    if (data.targetId !== undefined)
      doc.targetId = new Types.ObjectId(data.targetId);
    if (data.targetType !== undefined) doc.targetType = data.targetType;
    if (data.value !== undefined) doc.value = data.value;

    return doc;
  }
}
