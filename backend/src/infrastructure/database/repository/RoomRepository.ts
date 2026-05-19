import { Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import RoomModel from '../models/room/RoomModel';
import { RoomEntity } from '../../../domain/entities/room/RoomEntity';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { RoomDocument, RoomLeanDoc } from '../schemas/room/RoomSchema';

export class RoomRepository
  extends GenericRepository<RoomDocument, RoomEntity>
  implements IRoomRepository {
  constructor() {
    super(RoomModel as Model<RoomDocument>);
  }

  async findAllPublic(page: number, limit: number): Promise<PaginationResult<RoomEntity>> {
    const query = { visibility: 'PUBLIC_REQUEST' as RoomVisibility };

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<RoomLeanDoc[]>(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((doc) => this.leanToEntity(doc));

    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages };
  }

  protected toEntity(doc: RoomDocument): RoomEntity {
    return {
      id: doc._id.toString(),
      title: doc.title,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      hostId: doc.hostId.toString(),
      type: doc.type,
      visibility: doc.visibility,
      participantCount: doc.participantCount,
      maxParticipants: doc.maxParticipants,
      featureSnapshot: doc.featureSnapshot ?? null,
      lifecycleStatus: doc.lifecycleStatus,
      admissionPolicy: doc.admissionPolicy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(data: Partial<RoomEntity>): Partial<RoomDocument> {
    const doc: Partial<RoomDocument> = {};

    if (data.title !== undefined) doc.title = data.title;
    if (data.description !== undefined) doc.description = data.description;
    if (data.hostId !== undefined) doc.hostId = new Types.ObjectId(data.hostId);
    if (data.type !== undefined) doc.type = data.type;
    if (data.visibility !== undefined) doc.visibility = data.visibility;
    if (data.participantCount !== undefined)
      doc.participantCount = data.participantCount;
    if (data.maxParticipants !== undefined)
      doc.maxParticipants = data.maxParticipants;

    return doc;
  }

  leanToEntity(doc: RoomLeanDoc): RoomEntity {
    return {
      id: doc._id.toString(),
      title: doc.title,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      hostId: doc.hostId.toString(),
      type: doc.type,
      visibility: doc.visibility,
      participantCount: doc.participantCount,
      maxParticipants: doc.maxParticipants,
      featureSnapshot: doc.featureSnapshot ?? null,
      lifecycleStatus: doc.lifecycleStatus,
      admissionPolicy: doc.admissionPolicy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
