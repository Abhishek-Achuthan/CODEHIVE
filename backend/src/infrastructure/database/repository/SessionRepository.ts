import { injectable } from 'tsyringe';
import { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { SessionEntity } from '../../../domain/session/SessionEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { GenericRepository } from './GenericRepository';
import { SessionModel } from '../models/session/SessionModel';
import { SessionDoc, SessionLeanDoc } from '../schemas/session/SessionSchema';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { PopulatedSessionDoc } from '../types/PopulatedSessionDoc';
import { UserLeanDoc } from '../schemas/UserSchema';
import { EssentialUserInfo } from '../../../domain/types/EssentialUserInfo';
import { SessionWithParticipants } from '../../../domain/types/SessionWithParticipants';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';
import { SessionSchema } from '../../database/schemas/session/SessionSchema';

@injectable()
export class SessionRepository
  extends GenericRepository<SessionDoc, SessionEntity>
  implements ISessionRepository
{
  constructor() {
    super(SessionModel as Model<SessionDoc>);
  }

  async create(
    data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SessionEntity> {
    const session = await SessionModel.create(data);
    return this.toEntity(session);
  }

  async createWithSession(
    data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>,
    session: ClientSession,
  ): Promise<SessionEntity> {
    const docs = await SessionModel.create([data], { session });
    return this.toEntity(docs[0]!);
  }

  async findByMentorAndDate(
    mentorId: string,
    date: string,
  ): Promise<SessionEntity[]> {
    const docs = await SessionModel.find({
      mentorId,
      date,
      status: { $in: [SessionStatus.UPCOMING, SessionStatus.COMPLETED] },
    }).lean<SessionLeanDoc[]>();
    return docs.map((doc) => this.leanToEntity(doc));
  }

  async findByMentor(mentorId: string): Promise<SessionWithParticipants[]> {
    const docs = await SessionModel.find({ mentorId })
      .populate<{ mentorId: UserLeanDoc }>({
        path: 'mentorId',
        select: 'firstName lastName',
      })
      .populate<{ userId: UserLeanDoc }>({
        path: 'userId',
        select: 'firstName lastName',
      })
      .lean<PopulatedSessionDoc[]>();

    return docs.map((doc) => {
      const mentor: EssentialUserInfo = {
        id: doc.mentorId._id.toString(),
        firstName: doc.mentorId.firstName,
        lastName: doc.mentorId.lastName,
      };

      const user: EssentialUserInfo = {
        id: doc.userId._id.toString(),
        firstName: doc.userId.firstName,
        lastName: doc.userId.lastName,
      };

      const session: SessionEntity = {
        id: doc._id.toString(),
        mentorId: doc.mentorId._id.toString(),
        userId: doc.userId._id.toString(),
        roomId: doc.roomId ? doc.roomId.toString() : undefined,
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        paymentStatus: doc.paymentStatus,
        paymentSource: doc.paymentSource,
        paymentReferenceId: doc.paymentReferenceId,
        amount: doc.amount,
        status: doc.status,
        topic: doc.topic,
        sessionType: doc.sessionType,
        maxGuests: doc.maxGuests,
        ...(doc.joinUrl ? { joinUrl: doc.joinUrl } : {}),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      return { session, mentor, user };
    });
  }

  async findByUser(userId: string): Promise<SessionWithParticipants[]> {
    const docs = await SessionModel.find({ userId })
      .populate<{ mentorId: UserLeanDoc }>({
        path: 'mentorId',
        select: 'firstName lastName',
      })
      .populate<{ userId: UserLeanDoc }>({
        path: 'userId',
        select: 'firstName lastName',
      })
      .lean<PopulatedSessionDoc[]>();

    return docs.map((doc) => {
      const mentor: EssentialUserInfo = {
        id: doc.mentorId._id.toString(),
        firstName: doc.mentorId.firstName,
        lastName: doc.mentorId.lastName,
      };

      const user: EssentialUserInfo = {
        id: doc.userId._id.toString(),
        firstName: doc.userId.firstName,
        lastName: doc.userId.lastName,
      };

      const session: SessionEntity = {
        id: doc._id.toString(),
        mentorId: doc.mentorId._id.toString(),
        userId: doc.userId._id.toString(),
        roomId: doc.roomId ? doc.roomId.toString() : undefined,
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        paymentStatus: doc.paymentStatus,
        paymentSource: doc.paymentSource,
        paymentReferenceId: doc.paymentReferenceId,
        amount: doc.amount,
        status: doc.status,
        topic: doc.topic,
        sessionType: doc.sessionType,
        maxGuests: doc.maxGuests,
        ...(doc.joinUrl ? { joinUrl: doc.joinUrl } : {}),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      return { session, mentor, user };
    });
  }

  async listByParticipant(
    userId: string,
    options: {
      role?: 'mentor' | 'mentee' | 'all';
      page?: number;
      limit?: number;
      search?: string;
      filter?: {
        status?: SessionStatus;
        dateFrom?: string;
        dateTo?: string;
        paymentSource?: PaymentSource;
        refundableNow?: boolean;
        paymentStatus?: SessionPaymentStatus;
      };
    },
  ): Promise<PaginationResult<SessionWithParticipants>> {
    const query: FilterQuery<SessionDoc> = {};
    const role = options.role ?? 'all';
    const filter = options.filter;
    const andConditions: FilterQuery<SessionDoc>[] = [];

    if (role === 'mentor') {
      query.mentorId = new Types.ObjectId(userId);
    } else if (role === 'mentee') {
      query.userId = new Types.ObjectId(userId);
    } else {
      andConditions.push({
        $or: [
          { mentorId: new Types.ObjectId(userId) },
          { userId: new Types.ObjectId(userId) },
        ],
      });
    }

    if (filter?.status !== undefined) {
      if (filter.status === SessionStatus.UPCOMING) {
        andConditions.push({
          status: SessionStatus.UPCOMING,
          endTime: { $gte: new Date() },
        });
      } else if (filter.status === SessionStatus.COMPLETED) {
        andConditions.push({
          $or: [
            { status: SessionStatus.COMPLETED },
            { status: SessionStatus.UPCOMING, endTime: { $lt: new Date() } },
          ],
        });
      } else {
        andConditions.push({ status: filter.status });
      }
    }

    if (filter?.dateFrom !== undefined || filter?.dateTo !== undefined) {
      const dateQuery: {
        $gte?: string;
        $lte?: string;
      } = {};

      if (filter.dateFrom !== undefined) {
        dateQuery.$gte = filter.dateFrom;
      }

      if (filter.dateTo !== undefined) {
        dateQuery.$lte = filter.dateTo;
      }

      andConditions.push({ date: dateQuery });
    }

    if (filter?.paymentSource !== undefined) {
      andConditions.push({ paymentSource: filter.paymentSource });
    }

    if (filter?.paymentStatus !== undefined) {
      andConditions.push({ paymentStatus: filter.paymentStatus });
    }

    if (filter?.refundableNow === true) {
      andConditions.push({ status: SessionStatus.UPCOMING });
      andConditions.push({ paymentStatus: SessionPaymentStatus.PAID });
      andConditions.push({
        startTime: {
          $gt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    if (options.search) {
      andConditions.push({ topic: { $regex: options.search, $options: 'i' } });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    
    const sortCondition = filter?.status === SessionStatus.UPCOMING ? { startTime: 1 } : { createdAt: -1 };

    const totalItems = await SessionModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const docsQuery = SessionModel.find(query)
      .sort(sortCondition as any)
      .populate<{ mentorId: UserLeanDoc }>({
        path: 'mentorId',
        select: 'firstName lastName',
      })
      .populate<{ userId: UserLeanDoc }>({
        path: 'userId',
        select: 'firstName lastName',
      });

    if (options.page !== undefined && options.limit !== undefined) {
      docsQuery.skip(skip).limit(limit);
    }

    const docs = await docsQuery.lean<PopulatedSessionDoc[]>();

    const items = docs.map((doc) => {
      const mentor: EssentialUserInfo = {
        id: doc.mentorId._id.toString(),
        firstName: doc.mentorId.firstName,
        lastName: doc.mentorId.lastName,
      };

      const user: EssentialUserInfo = {
        id: doc.userId._id.toString(),
        firstName: doc.userId.firstName,
        lastName: doc.userId.lastName,
      };

      const session: SessionEntity = {
        id: doc._id.toString(),
        mentorId: doc.mentorId._id.toString(),
        userId: doc.userId._id.toString(),
        roomId: doc.roomId ? doc.roomId.toString() : undefined,
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        paymentStatus: doc.paymentStatus,
        paymentSource: doc.paymentSource,
        paymentReferenceId: doc.paymentReferenceId,
        amount: doc.amount,
        status: doc.status,
        topic: doc.topic,
        sessionType: doc.sessionType,
        maxGuests: doc.maxGuests,
        ...(doc.joinUrl ? { joinUrl: doc.joinUrl } : {}),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      return { session, mentor, user };
    });

    return { items, totalItems, totalPages };
  }

  async findByPaymentReference(
    referenceId: string,
  ): Promise<SessionEntity | null> {
    const doc = await SessionModel.findOne({ paymentReferenceId: referenceId });

    return doc ? this.toEntity(doc) : null;
  }

  async findUpcomingSessions(): Promise<SessionEntity[]> {
    const now = new Date();
    const activationWindow = new Date(now.getTime() + 15 * 60 * 1000);

    const doc = await SessionModel.find({
      status: SessionStatus.UPCOMING,
      paymentStatus: SessionPaymentStatus.PAID,
      roomId: null,
      startTime: {
        $gte: now,
        $lte: activationWindow,
      },
    }).lean();

    return doc.map((doc) => this.leanToEntity(doc));
  }

  async countSessionStats(mentorId: string): Promise<{ completed: number, cancelled: number }> {
    const stats = await SessionModel.aggregate([
      { $match: { mentorId: new Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: null,
          completed: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', SessionStatus.COMPLETED] },
                    {
                      $and: [
                        { $eq: ['$status', SessionStatus.UPCOMING] },
                        { $lt: ['$endTime', new Date()] },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', SessionStatus.CANCELLED] }, 1, 0] } }
        }
      }
    ]);
    return stats.length > 0 ? { completed: stats[0].completed, cancelled: stats[0].cancelled } : { completed: 0, cancelled: 0 };
  }

  protected toEntity(doc: SessionDoc): SessionEntity {
    return {
      id: doc._id.toString(),
      mentorId: doc.mentorId.toString(),
      userId: doc.userId.toString(),
      roomId: doc.roomId ? doc.roomId.toString() : undefined,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      status: doc.status,
      paymentStatus: doc.paymentStatus,
      paymentSource: doc.paymentSource,
      paymentReferenceId: doc.paymentReferenceId,
      amount: doc.amount,
      topic: doc.topic,
      sessionType: doc.sessionType,
      maxGuests: doc.maxGuests,
      ...(doc.joinUrl ? { joinUrl: doc.joinUrl } : {}),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private leanToEntity(doc: SessionLeanDoc): SessionEntity {
    return {
      id: doc._id.toString(),
      mentorId: doc.mentorId.toString(),
      userId: doc.userId.toString(),
      roomId: doc.roomId ? doc.roomId.toString() : undefined,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      status: doc.status,
      paymentStatus: doc.paymentStatus,
      paymentSource: doc.paymentSource,
      paymentReferenceId: doc.paymentReferenceId,
      amount: doc.amount,
      topic: doc.topic,
      sessionType: doc.sessionType,
      maxGuests: doc.maxGuests,
      ...(doc.joinUrl ? { joinUrl: doc.joinUrl } : {}),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(data: Partial<SessionEntity>): Partial<SessionDoc> {
    const doc: Partial<SessionDoc> = {};

    if (data.mentorId !== undefined)
      doc.mentorId = data.mentorId as unknown as SessionDoc['mentorId'];
    if (data.userId !== undefined)
      doc.userId = data.userId as unknown as SessionDoc['userId'];
    if (data.roomId !== undefined)
      doc.roomId = data.roomId as unknown as SessionDoc['roomId'];
    if (data.startTime !== undefined) doc.startTime = data.startTime;
    if (data.endTime !== undefined) doc.endTime = data.endTime;
    if (data.status !== undefined) doc.status = data.status;
    if (data.paymentSource !== undefined)
      doc.paymentSource = data.paymentSource;
    if (data.paymentStatus !== undefined)
      doc.paymentStatus = data.paymentStatus;
    if (data.paymentReferenceId !== undefined)
      doc.paymentReferenceId = data.paymentReferenceId;
    if (data.amount !== undefined) doc.amount = data.amount;
    if (data.topic !== undefined) doc.topic = data.topic;
    if (data.date !== undefined) doc.date = data.date;
    if (data.sessionType !== undefined) doc.sessionType = data.sessionType;
    if (data.maxGuests !== undefined) doc.maxGuests = data.maxGuests;
    if (data.joinUrl !== undefined) doc.joinUrl = data.joinUrl;

    return doc;
  }
}

SessionSchema.index({
  status: 1,
  paymentStatus: 1,
  roomId: 1,
  startTime: 1,
});
