import { injectable } from 'tsyringe';
import { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { SessionEntity } from '../../../domain/session/SessionEntity';
import { GenericRepository } from './GenericRepository';
import { SessionModel } from '../models/session/SessionModel';
import { SessionDoc } from '../schemas/session/SessionSchema';
import { Model } from 'mongoose';



@injectable()
export class SessionRepository extends GenericRepository<SessionDoc, SessionEntity> implements ISessionRepository {
    constructor() {
        super(SessionModel as Model<SessionDoc>);
    }

    async create(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionEntity> {
        const session = await SessionModel.create(data);
        return this.toEntity(session);
    }

    async findByMentorAndDate(mentorId: string, date: string): Promise<SessionEntity[]> {
        const docs = await SessionModel.find({ mentorId, date });
        return docs.map(doc => this.toEntity(doc));
    }

    async findByMentor(mentorId: string): Promise<SessionEntity[]> {
        const docs = await SessionModel.find({ mentorId });
        return docs.map(doc => this.toEntity(doc));
    }

    async findByUser(userId: string): Promise<SessionEntity[]> {
        const docs = await SessionModel.find({ userId });
        return docs.map(doc => this.toEntity(doc));
    }

    protected toEntity(doc: SessionDoc): SessionEntity {
        return {
            id: doc.id.toString(),
            mentorId: doc.mentorId,
            userId: doc.userId,
            date: doc.date,
            startTime: doc.startTime,
            endTime: doc.endTime,
            status: doc.status,
            topic: doc.topic,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    protected toDocument(data: Partial<SessionEntity>): Partial<SessionDoc> {
        const doc : Partial<SessionDoc> = {}
        
        if(data.mentorId !== undefined) doc.mentorId = data.mentorId;
        if(data.userId !== undefined) doc.userId = data.userId;
        if(data.startTime !== undefined) doc.startTime = data.startTime;
        if(data.endTime !== undefined) doc.endTime = data.endTime;
        if(data.status !== undefined) doc.status = data.status;
        if(data.topic !== undefined) doc.topic  = data.topic;
        if(data.date !== undefined) doc.date = data.date;
        
         return doc;
    }
}
