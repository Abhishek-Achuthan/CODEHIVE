import { injectable } from 'tsyringe';
import { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { SessionEntity } from '../../../domain/session/SessionEntity';
import { GenericRepository } from './GenericRepository';
import { SessionModel } from '../models/session/SessionModel';
import { SessionDoc, SessionLeanDoc } from '../schemas/session/SessionSchema';
import { ClientSession, Model } from 'mongoose';
import { PopulatedSessionDoc } from '../types/PopulatedSessionDoc';
import { UserLeanDoc } from '../schemas/UserSchema';
import { EssentialUserInfo } from '../../../domain/types/EssentialUserInfo';
import { SessionWithParticipants } from '../../../domain/types/SessionWithParticipants';
import { SessionStatus } from '../../../domain/types/SessionStatus';

@injectable()
export class SessionRepository
  extends GenericRepository<SessionDoc, SessionEntity>
  implements ISessionRepository
{
  constructor() {
    super(SessionModel as Model<SessionDoc>);
  }

  async create(
    data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SessionEntity> {
    const session = await SessionModel.create(data);
    return this.toEntity(session);
  }

  async createWithSession(
    data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>,
    session: ClientSession
  ): Promise<SessionEntity> {
    const docs = await SessionModel.create([data], { session });
    return this.toEntity(docs[0]!);
  }

  async findByMentorAndDate(
    mentorId: string,
    date: string
  ): Promise<SessionEntity[]> {
    const docs = await SessionModel.find({ mentorId, date,status:{$ne:SessionStatus.CANCELLED} });
    return docs.map((doc) => this.toEntity(doc));
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
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        paymentStatus:doc.paymentStatus,
        paymentSource:doc.paymentSource,
        paymentReferenceId:doc.paymentReferenceId,
        amount:doc.amount,
        status: doc.status,
        topic: doc.topic,
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
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        paymentStatus:doc.paymentStatus,
        paymentSource:doc.paymentSource,
        paymentReferenceId:doc.paymentReferenceId,
        amount: doc.amount,
        status: doc.status,
        topic: doc.topic,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      return { session, mentor, user };
    });
  }

  async findByPaymentReference(referenceId: string): Promise<SessionEntity | null> {
    
    const doc = await SessionModel.findOne({paymentReferenceId: referenceId})

    return doc ? this.leanToEntity(doc) : null

  }

  protected toEntity(doc: SessionDoc): SessionEntity {
    return {
      id: doc._id.toString(),
      mentorId: doc.mentorId.toString(),
      userId: doc.userId.toString(),
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      status: doc.status,
      paymentStatus: doc.paymentStatus,
      paymentSource: doc.paymentSource,
      paymentReferenceId: doc.paymentReferenceId,
      amount:doc.amount,
      topic: doc.topic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private leanToEntity(doc: SessionLeanDoc): SessionEntity {
    return {
      id: doc._id.toString(),
      mentorId: doc.mentorId.toString(),
      userId: doc.userId.toString(),
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      status: doc.status,
      paymentStatus:doc.paymentStatus,
      paymentSource: doc.paymentSource,
      paymentReferenceId: doc.paymentReferenceId,
      amount:doc.amount,
      topic: doc.topic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(data: Partial<SessionEntity>): Partial<SessionDoc> {
    const doc: Partial<SessionDoc> = {};

    if (data.mentorId !== undefined) doc.mentorId = data.mentorId as unknown as SessionDoc['mentorId'];
    if (data.userId !== undefined) doc.userId = data.userId as unknown as SessionDoc['userId'];
    if (data.startTime !== undefined) doc.startTime = data.startTime;
    if (data.endTime !== undefined) doc.endTime = data.endTime;
    if (data.status !== undefined) doc.status = data.status;
    if (data.paymentSource !== undefined) doc.paymentSource = data.paymentSource;
    if (data.paymentStatus !== undefined) doc.paymentStatus = data.paymentStatus;
    if (data.paymentReferenceId !== undefined) doc.paymentReferenceId = data.paymentReferenceId;
    if (data.amount !== undefined) doc.amount = data.amount; 
    if (data.topic !== undefined) doc.topic = data.topic;
    if (data.date !== undefined) doc.date = data.date;

    return doc;
  }
}
