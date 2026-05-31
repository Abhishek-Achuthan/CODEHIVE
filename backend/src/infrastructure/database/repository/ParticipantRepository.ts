import { Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import ParticipantModel from '../models/room/ParicipantModel';
import {
  ParticipantDocument,
  ParticipantLeanDoc,
} from '../schemas/room/ParticipantSchema';
import { ParticipantEntity } from '../../../domain/entities/room/ParticipantEntity';
import { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { ParticipantWithUser } from '../../../domain/types/ParticipantWithUser';

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

  async findByRoomIdWithUsers(roomId: string): Promise<ParticipantWithUser[]> {
    const docs = await this._model
      .find({ roomId: new Types.ObjectId(roomId) })
      .populate<{ userId: { _id: Types.ObjectId; firstName: string; lastName: string; avatarUrl?: string } }>(
        'userId',
        'firstName lastName avatarUrl'
      )
      .lean();

    return docs.map((doc: any) => ({
      userId: doc.userId._id.toString(),
      name: `${doc.userId.firstName} ${doc.userId.lastName}`,
      avatarUrl: doc.userId.avatarUrl,
      role: doc.role,
    }));
  }

  async removeByRoomAndUser(roomId: string, userId: string): Promise<void> {
    await this._model.deleteOne({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });
  }

  async removeAllByUser(userId: string): Promise<string[]> {
    const participants = await this._model.find({ userId: new Types.ObjectId(userId) }).lean();
    const roomIds = participants.map(p => p.roomId.toString());
    await this._model.deleteMany({ userId: new Types.ObjectId(userId) });
    return roomIds;
  }

  async updateOverrides(
    roomId: string,
    userId: string,
    overrides: Partial<Record<string, boolean>>,
  ): Promise<ParticipantEntity> {

    const current = await this._model
      .findOne({
        roomId: new Types.ObjectId(roomId),
        userId: new Types.ObjectId(userId),
      })
      .lean<ParticipantLeanDoc | null>();

    if (!current) {
      throw new Error('Participant not found during override update');
    }

    const existingOverrides = current.overrides ?? {};

    const mergedOverrides: Record<string, boolean> = { ...existingOverrides };
    for (const [key, value] of Object.entries(overrides)) {
      if (value !== undefined) {
        mergedOverrides[key] = value;
      }
    }

    const updated = await this._model
      .findOneAndUpdate(
        {
          roomId: new Types.ObjectId(roomId),
          userId: new Types.ObjectId(userId),
        },
        { $set: { overrides: mergedOverrides } },
        { new: true },
      )
      .lean<ParticipantLeanDoc | null>();

    if (!updated) {
      throw new Error('Participant not found during override update');
    }

    return this.leanToEntity(updated);
  }

  protected toEntity(doc: ParticipantDocument): ParticipantEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      role: doc.role,
      overrides: doc.overrides ?? {},
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
    if (data.overrides !== undefined) {
      doc.overrides = data.overrides as Record<string, boolean>;
    }

    return doc;
  }

  leanToEntity(doc: ParticipantLeanDoc): ParticipantEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      role: doc.role,
      overrides: doc.overrides ?? {},
      joinedAt: doc.createdAt,
    };
  }
}
