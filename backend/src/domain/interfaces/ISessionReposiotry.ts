import { ClientSession } from 'mongoose';
import { SessionEntity } from '../session/SessionEntity';
import { SessionWithParticipants } from '../types/SessionWithParticipants';
import { IGenericRepository } from './IGenericRepository';

export interface ISessionRepository extends IGenericRepository<SessionEntity> {
    create(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt' >): Promise<SessionEntity>;
    createWithSession(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt' >, session: ClientSession): Promise<SessionEntity>;

    findByMentorAndDate(
        mentorId: string,
        date: string
    ): Promise<SessionEntity[]>

    findByMentor(mentorId: string): Promise<SessionWithParticipants[]>;
    findByUser(userId: string): Promise<SessionWithParticipants[]>;
    findByPaymentReference(referenceId:string): Promise<SessionEntity | null>
}
