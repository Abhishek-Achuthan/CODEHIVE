
export type ParticipantStatus = 'online' | 'offline';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: ParticipantStatus;
  role: 'HOST' | 'MENTOR' | 'PARTICIPANT';
  isCurrentUser?: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  parentMessageId?: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
}

export type TabType = 'chat' | 'whiteboard' | 'notes' | 'polls';
