import { MentorStatus } from '../../domain/types/MentorStatus';
import { UserRole } from '../../domain/types/UserRole';

export interface AuthenticateRealtimeUserDTO {
  token: string;
}

export interface RealtimeUserContextDTO {
  userId: string;
  role: UserRole;
  mentorStatus: MentorStatus;
}

export interface AuthorizeCollaborationAccessDTO {
  userId: string;
  documentName: string;
}
