import { Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import ParticipantModel from '../models/room/ParicipantModel';
import {
  ParticipantDocument,
  ParticipantLeanDoc,
} from '../schemas/room/ParticipantSchema';
import { ParticipantEntity } from '../../../domain/entities/room/ParticipantEntity';
import { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';

export class ParticipantRepository
  extends GenericRepository<ParticipantDocument, ParticipantEntity>
  implements IParticipantRepository
{
  constructor() {
    super(ParticipantModel as Model<ParticipantDocument>);
  }

  async findByRoomAndUser(
    roomId: string,
    userId: string
  ): Promise<ParticipantEntity | null> {
    const doc = await this._model
      .findOne({
        roomId: new Types.ObjectId(roomId),
        userId: new Types.ObjectId(userId),
      })
      .lean<ParticipantLeanDoc | null>();

    return doc ? this.leanToEntity(doc) : null;
  }

  async findByRoomId(roomId: string): Promise<ParticipantEntity[]> {
    const docs = await this._model
      .find({ roomId: new Types.ObjectId(roomId) })
      .lean<ParticipantLeanDoc[]>();

    return docs.map((doc) => this.leanToEntity(doc));
  }

  async countByRoomId(roomId: string): Promise<number> {
    return this._model.countDocuments({ roomId: new Types.ObjectId(roomId) });
  }

  protected toEntity(doc: ParticipantDocument): ParticipantEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      role: doc.role,
      joinedAt: doc.createdAt,
    };
  }

  protected toDocument(
    data: Partial<ParticipantEntity>
  ): Partial<ParticipantDocument> {
    const doc: Partial<ParticipantDocument> = {};

    if (data.roomId !== undefined) doc.roomId = new Types.ObjectId(data.roomId);
    if (data.userId !== undefined) doc.userId = new Types.ObjectId(data.userId);
    if (data.role !== undefined) doc.role = data.role;
    if (data.joinedAt !== undefined) doc.createdAt = data.joinedAt;

    return doc;
  }

  leanToEntity(doc: ParticipantLeanDoc): ParticipantEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      role: doc.role,
      joinedAt: doc.createdAt,
    };
  }
}
