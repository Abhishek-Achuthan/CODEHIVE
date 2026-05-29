import type { Socket } from 'socket.io-client';
import type {
  CapabilityKey,
  RoomFeatureSnapshotResponse,
  JoinRoomSnapshotResponse,
  MessageDeletedResponse,
  MessageEditedResponse,
  RoomLifecycleStatus,
  RoomRole,
  RoomMessageResponse,
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
  role?: RoomRole;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // array of userIds
}

export interface Poll {
  id: string;
  roomId: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  isActive: boolean;
  createdBy: string;
  expiresAt?: string;
  createdAt: string;
}

export type RoomSnapshot = JoinRoomSnapshotResponse;

export interface RoomSubscribedPayload {
  roomId: string;
  onlineUserIds?: string[];
  capabilities?: Partial<Record<CapabilityKey, boolean>>;
  lifecycleStatus?: RoomLifecycleStatus;
  featureSnapshot?: RoomFeatureSnapshotResponse | null;
}

export interface RoomLifecycleChangedPayload {
  roomId: string;
  lifecycleStatus: RoomLifecycleStatus;
}

export interface RoomUserJoinedPayload {
  roomId?: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  role?: RoomRole;
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
  'room:lifecycle-changed': (payload: RoomLifecycleChangedPayload) => void;
  'message:created': (payload: Message) => void;
  'message:edited': (payload: MessageEditedResponse) => void;
  'message:deleted': (payload: MessageDeletedResponse) => void;
  'room:user-joined': (payload: RoomUserJoinedPayload) => void;
  'room:user-left': (payload: RoomUserLeftPayload) => void;
  'typing:start': (payload: TypingStartPayload) => void;
  'typing:stop': (payload: TypingStopPayload) => void;
  'poll:created': (payload: Poll) => void;
  'poll:voted': (payload: Poll) => void;
  'poll:ended': (payload: Poll) => void;
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
