import { PaymentSource } from '../types/PaymentSource';
import { SessionPaymentStatus } from '../types/SessionPaymentStatus';
import { SessionStatus } from '../types/SessionStatus';

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
  createdAt: Date;
  updatedAt: Date;
  roomId?: string;
}
