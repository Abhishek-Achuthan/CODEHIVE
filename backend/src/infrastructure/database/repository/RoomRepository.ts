import { FilterQuery, Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import RoomModel from '../models/room/RoomModel';
import { RoomEntity, RoomFeatureSnapshot } from '../../../domain/entities/room/RoomEntity';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { RoomDocument, RoomLeanDoc } from '../schemas/room/RoomSchema';
import { LimitKey } from '../../../domain/types/LimitKey';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { RoomType } from '../../../domain/types/RoomType';

type LimitMap = Map<LimitKey, number>;

function mapToDomainFeatureSnapshot(snapshot: any): RoomFeatureSnapshot | null {
  if (!snapshot) return null;

  const limits = snapshot.limits;
  let plainLimits: Partial<Record<LimitKey, number>> = {};

  if (limits) {
    if (limits instanceof Map) {
      plainLimits = Object.fromEntries(limits) as Partial<Record<LimitKey, number>>;
    } else {
      plainLimits = limits as Partial<Record<LimitKey, number>>;
    }
  }

  return {
    planId: snapshot.planId,
    planName: snapshot.planName,
    enabledFeatures: snapshot.enabledFeatures,
    limits: plainLimits,
  };
}

function mapToDatabaseFeatureSnapshot(snapshot: RoomFeatureSnapshot | null): any {
  if (!snapshot) return null;

  return {
    planId: snapshot.planId,
    planName: snapshot.planName,
    enabledFeatures: snapshot.enabledFeatures,
    limits: (snapshot.limits
      ? new Map(Object.entries(snapshot.limits))
      : new Map()) as LimitMap,
  };
}

export class RoomRepository
  extends GenericRepository<RoomDocument, RoomEntity>
  implements IRoomRepository
{
  constructor() {
    super(RoomModel as Model<RoomDocument>);
  }

  async findAllPublic(
    page: number,
    limit: number,
    search?: string,
    dateFrom?: string,
    status?: string
  ): Promise<PaginationResult<RoomEntity>> {
    let query: FilterQuery<RoomDocument> = { visibility: 'PUBLIC_REQUEST' as RoomVisibility };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom) {
      const start = new Date(dateFrom);
      if (!Number.isNaN(start.getTime())) {
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(dateFrom);
        end.setUTCHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    if (status) {
      if (status === 'ACTIVE') {
        query.lifecycleStatus = RoomLifeCycleStatus.ACTIVE;
      } else if (status === 'INACTIVE') {
        query.lifecycleStatus = { $in: [RoomLifeCycleStatus.ARCHIVED, RoomLifeCycleStatus.READONLY] };
      } else {
        query.lifecycleStatus = status as RoomLifeCycleStatus;
      }
    } else {
      query.lifecycleStatus = { $ne: RoomLifeCycleStatus.PURGED };
    }

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .populate('hostId', 'firstName lastName avatarUrl username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((doc: any) => {
       const entity = this.leanToEntity(doc);
       if (doc.hostId && typeof doc.hostId === 'object') {
           entity.hostId = doc.hostId._id.toString();
           const fName = doc.hostId.firstName || '';
           const lName = doc.hostId.lastName || '';
           const fullName = `${fName} ${lName}`.trim();
           entity.hostName = fullName || doc.hostId.username || 'Unknown';
           entity.hostAvatarUrl = doc.hostId.avatarUrl;
       }
       return entity;
    });

    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages };
  }

  async findAllByHostId(
    hostId: string,
    page: number,
    limit: number,
    search?:string,
    dateFrom?: string,
    status?: string
  ): Promise<PaginationResult<RoomEntity>> {

    let query: FilterQuery<RoomDocument> = {};

    query.hostId = new Types.ObjectId(hostId);
    query.type = {$ne : RoomType.SESSION};
    
    if (search) {
      query.$or = [
        {title: {$regex:search,$options:'i'}}
      ]
    }

    if (dateFrom) {
      const start = new Date(dateFrom);
      if (!Number.isNaN(start.getTime())) {
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(dateFrom);
        end.setUTCHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    if (status) {
      if (status === 'ACTIVE') {
        query.lifecycleStatus = RoomLifeCycleStatus.ACTIVE;
      } else if (status === 'INACTIVE') {
        query.lifecycleStatus = { $in: [RoomLifeCycleStatus.ARCHIVED, RoomLifeCycleStatus.READONLY] };
      } else {
        query.lifecycleStatus = status as RoomLifeCycleStatus;
      }
    } else {
      query.lifecycleStatus = {$ne : RoomLifeCycleStatus.PURGED};
    }

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .populate('hostId', 'firstName lastName avatarUrl username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((doc: any) => {
       const entity = this.leanToEntity(doc);
       if (doc.hostId && typeof doc.hostId === 'object') {
           entity.hostId = doc.hostId._id.toString();
           const fName = doc.hostId.firstName || '';
           const lName = doc.hostId.lastName || '';
           const fullName = `${fName} ${lName}`.trim();
           entity.hostName = fullName || doc.hostId.username || 'Unknown';
           entity.hostAvatarUrl = doc.hostId.avatarUrl;
       }
       return entity;
    });
    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages };
  }

  protected toEntity(doc: RoomDocument): RoomEntity {
    return {
      id: doc._id.toString(),
      title: doc.title,
      hostId: doc.hostId.toString(),
      type: doc.type,
      visibility: doc.visibility,
      participantCount: doc.participantCount,
      maxParticipants: doc.maxParticipants,
      featureSnapshot: mapToDomainFeatureSnapshot(doc.featureSnapshot),
      lifecycleStatus: doc.lifecycleStatus,
      admissionPolicy: doc.admissionPolicy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ...(doc.description !== undefined
        ? { description: doc.description }
        : {}),
      ...(doc.sessionId && { sessionId: doc.sessionId.toString() }),
      ...(doc.readonlyAt && { readonlyAt: doc.readonlyAt }),
      ...(doc.archivedAt && { archivedAt: doc.archivedAt }),
      ...(doc.purgedAt && { purgedAt: doc.purgedAt }),
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
    if (data.featureSnapshot !== undefined) {
      doc.featureSnapshot = mapToDatabaseFeatureSnapshot(data.featureSnapshot);
    }

    if (data.lifecycleStatus !== undefined)
      doc.lifecycleStatus = data.lifecycleStatus;

    if (data.admissionPolicy !== undefined)
      doc.admissionPolicy = data.admissionPolicy;

    if (data.sessionId !== undefined)
      doc.sessionId = new Types.ObjectId(data.sessionId);

    if (data.readonlyAt !== undefined) doc.readonlyAt = data.readonlyAt;

    if (data.archivedAt !== undefined) doc.archivedAt = data.archivedAt;

    if (data.purgedAt !== undefined) doc.purgedAt = data.purgedAt;

    return doc;
  }

  leanToEntity(doc: RoomLeanDoc): RoomEntity {
    return {
      id: doc._id.toString(),
      title: doc.title,
      ...(doc.description !== undefined
        ? { description: doc.description }
        : {}),
      hostId: doc.hostId.toString(),
      type: doc.type,
      visibility: doc.visibility,
      participantCount: doc.participantCount,
      maxParticipants: doc.maxParticipants,
      featureSnapshot: mapToDomainFeatureSnapshot(doc.featureSnapshot),
      lifecycleStatus: doc.lifecycleStatus,
      admissionPolicy: doc.admissionPolicy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ...(doc.sessionId && { sessionId: doc.sessionId.toString() }),
      ...(doc.readonlyAt && { readonlyAt: doc.readonlyAt }),
      ...(doc.archivedAt && { archivedAt: doc.archivedAt }),
      ...(doc.purgedAt && { purgedAt: doc.purgedAt }),
    };
  }

  async countActiveRoomsByHostId(hostId: string): Promise<number> {
    return this._model.countDocuments({
      hostId: new Types.ObjectId(hostId),
      lifecycleStatus: RoomLifeCycleStatus.ACTIVE,
    });
  }

  async incrementParticipantCount(
    roomId: string,
    maxParticipants: number,
  ): Promise<RoomEntity | null> {
    const updated = await this._model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(roomId),
        participantCount: { $lt: maxParticipants },
      },
      { $inc: { participantCount: 1 } },
      { new: true },
    );

    return updated ? this.toEntity(updated as RoomDocument) : null;
  }


  async decrementParticipantCount(roomId: string): Promise<RoomEntity | null> {
    const updated = await this._model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(roomId),
        participantCount: { $gt: 0 },
      },
      { $inc: { participantCount: -1 } },
      { new: true },
    );

    return updated ? this.toEntity(updated as RoomDocument) : null;
  }
}
