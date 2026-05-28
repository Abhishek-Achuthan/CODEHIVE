import { Model, Types } from 'mongoose';
import { IRoomInviteRepository } from '../../../domain/interfaces/IRoomInviteRepository';
import { RoomInviteEntity } from '../../../domain/entities/room/RoomInviteEntity';
import { RoomInviteType } from '../../../domain/types/RoomInviteType';
import RoomInviteModel from '../models/room/RoomInviteModel';
import {
  RoomInviteDocument,
  RoomInviteLeanDoc,
} from '../schemas/room/RoomInviteSchema';

export class RoomInviteRepository implements IRoomInviteRepository {
  private readonly _model: Model<RoomInviteDocument>;

  constructor() {
    this._model = RoomInviteModel;
  }

  async create(
    data: Omit<RoomInviteEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RoomInviteEntity> {
    const doc = await this._model.create({
      roomId: new Types.ObjectId(data.roomId),
      codeHash: data.codeHash,
      createdBy: new Types.ObjectId(data.createdBy),
      type: data.type,
      ...(data.sessionId !== undefined
        ? { sessionId: new Types.ObjectId(data.sessionId) }
        : {}),
      ...(data.expiresAt !== undefined ? { expiresAt: data.expiresAt } : {}),
      ...(data.maxUses !== undefined ? { maxUses: data.maxUses } : {}),
      useCount: data.useCount,
      ...(data.revokedAt !== undefined ? { revokedAt: data.revokedAt } : {}),
    });

    return this._toEntity(doc);
  }

  async findByCodeHash(codeHash: string): Promise<RoomInviteEntity | null> {
    const doc = await this._model.findOne({ codeHash }).lean<RoomInviteLeanDoc | null>();
    return doc ? this._leanToEntity(doc) : null;
  }

  async findActiveByRoomId(
    roomId: string,
    type?: RoomInviteType,
  ): Promise<RoomInviteEntity | null> {
    const query: Record<string, unknown> = {
      roomId: new Types.ObjectId(roomId),
      revokedAt: { $exists: false },
    };

    if (type !== undefined) {
      query.type = type;
    }

    const doc = await this._model
      .findOne(query)
      .sort({ createdAt: -1 })
      .lean<RoomInviteLeanDoc | null>();

    return doc ? this._leanToEntity(doc) : null;
  }

  async findActiveBySessionId(sessionId: string): Promise<RoomInviteEntity | null> {
    const doc = await this._model
      .findOne({
        sessionId: new Types.ObjectId(sessionId),
        revokedAt: { $exists: false },
      })
      .lean<RoomInviteLeanDoc | null>();

    return doc ? this._leanToEntity(doc) : null;
  }

  async listByRoomId(roomId: string): Promise<RoomInviteEntity[]> {
    const docs = await this._model
      .find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 })
      .lean<RoomInviteLeanDoc[]>();

    return docs.map((doc) => this._leanToEntity(doc));
  }

  async revokeById(inviteId: string): Promise<RoomInviteEntity | null> {
    const doc = await this._model
      .findByIdAndUpdate(
        inviteId,
        { revokedAt: new Date() },
        { new: true },
      )
      .lean<RoomInviteLeanDoc | null>();

    return doc ? this._leanToEntity(doc) : null;
  }

  async revokeAllActiveForRoom(roomId: string, type?: RoomInviteType): Promise<void> {
    const query: Record<string, unknown> = {
      roomId: new Types.ObjectId(roomId),
      revokedAt: { $exists: false },
    };

    if (type !== undefined) {
      query.type = type;
    }

    await this._model.updateMany(query, { revokedAt: new Date() });
  }

  async incrementUseCount(inviteId: string): Promise<void> {
    await this._model.findByIdAndUpdate(inviteId, { $inc: { useCount: 1 } });
  }

  private _toEntity(doc: RoomInviteDocument): RoomInviteEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      codeHash: doc.codeHash,
      createdBy: doc.createdBy.toString(),
      type: doc.type,
      ...(doc.sessionId !== undefined ? { sessionId: doc.sessionId.toString() } : {}),
      ...(doc.expiresAt !== undefined ? { expiresAt: doc.expiresAt } : {}),
      ...(doc.maxUses !== undefined ? { maxUses: doc.maxUses } : {}),
      useCount: doc.useCount,
      ...(doc.revokedAt !== undefined ? { revokedAt: doc.revokedAt } : {}),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private _leanToEntity(doc: RoomInviteLeanDoc): RoomInviteEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      codeHash: doc.codeHash,
      createdBy: doc.createdBy.toString(),
      type: doc.type,
      ...(doc.sessionId !== undefined ? { sessionId: doc.sessionId.toString() } : {}),
      ...(doc.expiresAt !== undefined ? { expiresAt: doc.expiresAt } : {}),
      ...(doc.maxUses !== undefined ? { maxUses: doc.maxUses } : {}),
      useCount: doc.useCount,
      ...(doc.revokedAt !== undefined ? { revokedAt: doc.revokedAt } : {}),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
