import { SessionEntity } from '../session/SessionEntity';
import { SessionWithParticipants } from '../types/SessionWithParticipants';
import { IGenericRepository } from './IGenericRepository';

export interface ISessionRepository extends IGenericRepository<SessionEntity> {
    create(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt' | 'refunded'>): Promise<SessionEntity>;

    findByMentorAndDate(
        mentorId: string,
        date: string
    ): Promise<SessionEntity[]>

    findByMentor(mentorId: string): Promise<SessionWithParticipants[]>;
    findByUser(userId: string): Promise<SessionWithParticipants[]>;
}