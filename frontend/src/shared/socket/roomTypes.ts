import type { Socket } from 'socket.io-client';
import type {
  JoinRoomSnapshotResponse,
  MessageDeletedResponse,
  MessageEditedResponse,
  RoomMessageResponse,
  RoomPollResponse,
} from '../types/api/room';

export type RoomConnectionState =
  | 'idle'
  | 'joining'
  | 'snapshot-ready'
  | 'subscribing'
  | 'ready'
  | 'error';

export type Message = RoomMessageResponse;

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export type Poll = RoomPollResponse;

export type RoomSnapshot = JoinRoomSnapshotResponse;

export interface RoomSubscribedPayload {
  roomId: string;
  onlineUserIds?: string[];
}

export interface RoomUserJoinedPayload {
  roomId?: string;
  userId: string;
  name: string;
  avatarUrl?: string;
}

export interface RoomUserLeftPayload {
  roomId: string;
  userId: string;
}

export interface TypingStartPayload {
  roomId?: string;
  userId: string;
  name: string;
}

export interface TypingStopPayload {
  roomId?: string;
  userId: string;
}

export interface SocketErrorPayload {
  message: string;
}

export interface ServerToClientRoomEvents {
  'room:subscribed': (payload: RoomSubscribedPayload) => void;
  'message:created': (payload: Message) => void;
  'message:edited': (payload: MessageEditedResponse) => void;
  'message:deleted': (payload: MessageDeletedResponse) => void;
  'room:user-joined': (payload: RoomUserJoinedPayload) => void;
  'room:user-left': (payload: RoomUserLeftPayload) => void;
  'typing:start': (payload: TypingStartPayload) => void;
  'typing:stop': (payload: TypingStopPayload) => void;
  'poll:created': (payload: Poll) => void;
  'poll:voted': (payload: Poll) => void;
  error: (payload: SocketErrorPayload) => void;
}

export interface ClientToServerRoomEvents {
  'room:subscribe': (payload: {
    roomId: string;
    user: {
      name: string;
      avatarUrl?: string;
    };
  }) => void;
  'room:leave': (payload: { roomId: string }) => void;
  'typing:start': (payload: { roomId: string; name: string }) => void;
  'typing:stop': (payload: { roomId: string }) => void;
}

export type RoomSocket = Socket<
  ServerToClientRoomEvents,
  ClientToServerRoomEvents
>;
