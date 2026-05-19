import { ClientSession } from 'mongoose';
import { SessionEntity } from '../session/SessionEntity';
import { SessionWithParticipants } from '../types/SessionWithParticipants';
import { IGenericRepository } from './IGenericRepository';
import { SessionPaymentStatus } from '../types/SessionPaymentStatus';
import { SessionStatus } from '../types/SessionStatus';
import { PaymentSource } from '../types/PaymentSource';

export interface ISessionRepository extends IGenericRepository<SessionEntity> {
  create(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionEntity>;
  createWithSession(data: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>, session: ClientSession): Promise<SessionEntity>;

  findByMentorAndDate(
    mentorId: string,
    date: string
  ): Promise<SessionEntity[]>

  findByMentor(mentorId: string): Promise<SessionWithParticipants[]>;
  findByUser(userId: string): Promise<SessionWithParticipants[]>;
  listByParticipant(userId: string, options: {
    role?: 'mentor' | 'mentee' | 'all';
    page?: number;
    limit?: number;
    filter?: {
      status?: SessionStatus;
      dateFrom?: string;
      dateTo?: string;
      paymentSource?: PaymentSource;
      refundableNow?: boolean;
      paymentStatus?: SessionPaymentStatus;
    };
  }): Promise<SessionWithParticipants[]>;
  findByPaymentReference(referenceId: string): Promise<SessionEntity | null>
  findUpcomingSessions(): Promise<SessionEntity[]>
}
