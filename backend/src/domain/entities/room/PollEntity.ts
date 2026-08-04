import { PollOption } from '../../types/PollOption';

export interface PollEntity {
  id: string;

  roomId: string;

  question: string;

  options: PollOption[];

  createdBy: string;

  isActive: boolean;

  allowMultiple?: boolean;

  expiresAt?: Date;

  createdAt: Date;
  
  updatedAt: Date;
}