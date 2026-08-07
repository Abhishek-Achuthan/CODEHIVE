import { Model, Types } from 'mongoose';
import {
  AdminReportListResult,
  IRoomReportRepository,
} from '../../../domain/interfaces/IRoomReportRepository';
import { RoomReportEntity } from '../../../domain/entities/room/RoomReportEntity';
import RoomReportModel from '../models/room/RoomReportModel';
import { RoomReportDocument } from '../schemas/room/RoomReportSchema';

interface PopulatedRoomRef {
  _id: Types.ObjectId;
  title: string;
}

interface PopulatedUserRef {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
}

interface AdminReportDetailsRecord {
  _id: Types.ObjectId;
  roomId: Types.ObjectId | PopulatedRoomRef | null;
  reporterId: Types.ObjectId | PopulatedUserRef | null;
  reportedUserId: Types.ObjectId | PopulatedUserRef | null;
  reason: string;
  description?: string;
  resolvedBy?: Types.ObjectId;
  status: RoomReportEntity['status'];
  createdAt: Date;
  updatedAt: Date;
}

const isPopulatedRoomRef = (value: AdminReportDetailsRecord['roomId']): value is PopulatedRoomRef =>
  typeof value === 'object' && value !== null && 'title' in value;

const isPopulatedUserRef = (
  value: AdminReportDetailsRecord['reporterId'] | AdminReportDetailsRecord['reportedUserId'],
): value is PopulatedUserRef => typeof value === 'object' && value !== null && 'email' in value;

export class RoomReportRepository implements IRoomReportRepository {
  private readonly _model: Model<RoomReportDocument>;

  constructor() {
    this._model = RoomReportModel;
  }

  async create(
    data: Omit<RoomReportEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<RoomReportEntity> {
    const doc = await this._model.create({
      roomId: new Types.ObjectId(data.roomId),
      reporterId: new Types.ObjectId(data.reporterId),
      reportedUserId: new Types.ObjectId(data.reportedUserId),
      reason: data.reason,
      ...(data.description !== undefined ? { description: data.description } : {}),
    });

    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      reporterId: doc.reporterId.toString(),
      reportedUserId: doc.reportedUserId.toString(),
      reason: doc.reason,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      ...(doc.resolvedBy !== undefined ? { resolvedBy: doc.resolvedBy.toString() } : {}),
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAllWithDetails(page: number, limit: number): Promise<AdminReportListResult> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this._model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('roomId', 'title')
        .populate('reporterId', 'firstName lastName email')
        .populate('reportedUserId', 'firstName lastName email')
        .lean(),
      this._model.countDocuments(),
    ]);

    return {
      data: (data as unknown as AdminReportDetailsRecord[]).map((doc) => ({
        id: doc._id.toString(),
        room: isPopulatedRoomRef(doc.roomId) ? {
          id: doc.roomId._id.toString(),
          title: doc.roomId.title,
        } : null,
        reporter: isPopulatedUserRef(doc.reporterId) ? {
          id: doc.reporterId._id.toString(),
          name: `${doc.reporterId.firstName} ${doc.reporterId.lastName}`,
          email: doc.reporterId.email,
        } : null,
        reportedUser: isPopulatedUserRef(doc.reportedUserId) ? {
          id: doc.reportedUserId._id.toString(),
          name: `${doc.reportedUserId.firstName} ${doc.reportedUserId.lastName}`,
          email: doc.reportedUserId.email,
        } : null,
        reason: doc.reason,
        ...(doc.description !== undefined ? { description: doc.description } : {}),
        resolvedBy: doc.resolvedBy ? doc.resolvedBy.toString() : null,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      total,
    };
  }

  async updateStatus(id: string, status: RoomReportEntity['status'], resolvedBy?: string): Promise<RoomReportEntity | null> {
    const updateData: any = { status };
    if (resolvedBy) {
      updateData.resolvedBy = new Types.ObjectId(resolvedBy);
    }

    const doc = await this._model.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      reporterId: doc.reporterId.toString(),
      reportedUserId: doc.reportedUserId.toString(),
      reason: doc.reason,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      ...(doc.resolvedBy !== undefined ? { resolvedBy: doc.resolvedBy.toString() } : {}),
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
