import { RoomRole } from './RoomRole';

export interface ParticipantWithUser {
    userId: string;
    name: string;
    avatarUrl?: string;
    role: RoomRole;
}
