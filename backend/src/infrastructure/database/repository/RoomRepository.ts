import { Model, Types } from "mongoose";

import { GenericRepository } from "./GenericRepository";
import RoomModel from "../models/room/RoomModel";
import { RoomEntity, RoomFeatureSnapshot } from "../../../domain/entities/room/RoomEntity";
import { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import { PaginationResult } from "../../../domain/types/PaginationResult";
import { RoomVisibility } from "../../../domain/types/RoomVisibility";
import { RoomDocument, RoomLeanDoc } from "../schemas/room/RoomSchema";
import { LimitKey } from "../../../domain/types/LimitKey";
import { RoomLifeCycleStatus } from "../../../domain/types/RoomLifeCycleStatus";

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
  ): Promise<PaginationResult<RoomEntity>> {
    const query = { visibility: "PUBLIC_REQUEST" as RoomVisibility };

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
}
