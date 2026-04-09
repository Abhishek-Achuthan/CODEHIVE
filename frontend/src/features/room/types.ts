
export type ParticipantStatus = 'online' | 'offline';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: ParticipantStatus;
  isCurrentUser?: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export type TabType = 'chat' | 'whiteboard' | 'notes' | 'polls';
