import { SessionEntity } from '../session/SessionEntity';
import { IGenericRepository } from './IGenericRepository';

export interface ISessionRepository extends IGenericRepository<SessionEntity> {
    create(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionEntity>;

    findByMentorAndDate(
        mentorId: string,
        date: string
    ): Promise<SessionEntity[]>

    findByMentor(mentorId: string): Promise<SessionEntity[]>;
    findByUser(userId: string): Promise<SessionEntity[]>;
}