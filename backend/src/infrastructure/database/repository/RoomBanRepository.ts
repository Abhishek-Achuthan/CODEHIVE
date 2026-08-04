import { Model, Types } from 'mongoose';
import { IRoomBanRepository } from '../../../domain/interfaces/IRoomBanRepository';
import { RoomBanEntity } from '../../../domain/entities/room/RoomBanEntity';
import RoomBanModel from '../models/room/RoomBanModel';
import { RoomBanDocument, RoomBanLeanDoc } from '../schemas/room/RoomBanSchema';

export class RoomBanRepository implements IRoomBanRepository {
  private readonly _model: Model<RoomBanDocument>;

  constructor() {
    this._model = RoomBanModel;
  }

  async create(
    data: Omit<RoomBanEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RoomBanEntity> {
    const doc = await this._model.create({
      roomId: new Types.ObjectId(data.roomId),
      userId: new Types.ObjectId(data.userId),
      bannedBy: new Types.ObjectId(data.bannedBy),
      bannedAt: data.bannedAt,
    });

    return this._toEntity(doc);
  }

  async exists(roomId: string, userId: string): Promise<boolean> {
    const count = await this._model.countDocuments({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });

    return count > 0;
  }

  async findByRoomAndUser(
    roomId: string,
    userId: string,
  ): Promise<RoomBanEntity | null> {
    const doc = await this._model
      .findOne({
        roomId: new Types.ObjectId(roomId),
        userId: new Types.ObjectId(userId),
      })
      .lean<RoomBanLeanDoc | null>();

    return doc ? this._leanToEntity(doc) : null;
  }

  async delete(roomId: string, userId: string): Promise<void> {
    await this._model.deleteOne({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });
  }

  private _toEntity(doc: RoomBanDocument): RoomBanEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      bannedBy: doc.bannedBy.toString(),
      bannedAt: doc.bannedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private _leanToEntity(doc: RoomBanLeanDoc): RoomBanEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      userId: doc.userId.toString(),
      bannedBy: doc.bannedBy.toString(),
      bannedAt: doc.bannedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
