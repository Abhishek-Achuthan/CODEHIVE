
import type { RoomRole } from "../../shared/types/api/room";

export type ParticipantStatus = 'online' | 'offline';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: ParticipantStatus;
  role: RoomRole;
  isCurrentUser?: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  parentMessageId?: string;
  content: string;
  timestamp: string;
  isDeleted?: boolean;
  isEdited?: boolean;
}

export type TabType = 'chat' | 'whiteboard' | 'notes' | 'polls' | 'video';
