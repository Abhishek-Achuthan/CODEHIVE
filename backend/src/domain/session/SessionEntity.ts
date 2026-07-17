import { PaymentSource } from '../types/PaymentSource';
import { SessionPaymentStatus } from '../types/SessionPaymentStatus';
import { SessionStatus } from '../types/SessionStatus';
import { SessionType } from '../types/SessionType';

export interface SessionEntity {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  topic: string;
  paymentStatus: SessionPaymentStatus;
  paymentSource: PaymentSource;
  paymentReferenceId: string | null;
  amount: number;
  sessionType: SessionType;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
  roomId?: string | undefined;
  joinUrl?: string | undefined;
}
