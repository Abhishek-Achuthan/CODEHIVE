import type { PaginatedResponse } from "../core/api";
export type RoomVisibility = "PUBLIC_REQUEST" | "PRIVATE";
export type RoomLifecycleStatus =
  | "SCHEDULED"
  | "ACTIVE"
  | "READONLY"
  | "ARCHIVED"
  | "PURGED";
export type RoomRole = "HOST" | "PARTICIPANT" | "VIEWER";
export type FeatureKey =
  | "chat"
  | "notes"
  | "polls"
  | "whiteboard"
  | "screen_share"
  | "code_editor"
  | "video_audio"
  | "private_rooms"
  | "session_booking";
export type LimitKey =
  | "max_participants"
  | "max_active_rooms"
  | "max_session_hours";
export type CapabilityKey =
  | "room.chat.read"
  | "room.chat.write"
  | "room.chat.delete_own"
  | "room.public_notes.view"
  | "room.public_notes.edit"
  | "room.private_notes.view"
  | "room.private_notes.edit"
  | "room.polls.create"
  | "room.polls.vote"
  | "room.polls.close"
  | "room.whiteboard.view"
  | "room.whiteboard.draw"
  | "room.whiteboard.clear"
  | "room.code.view"
  | "room.code.edit"
  | "room.code.run"
  | "room.screenshare.start"
  | "room.participant.mute"
  | "room.participant.kick"
  | "room.participant.promote"
  | "room.manage.permissions"
  | "room.manage.settings";

export interface RoomFeatureSnapshotResponse {
  planId: string;
  planName: string;
  enabledFeatures: FeatureKey[];
  limits: Partial<Record<LimitKey, number>>;
}

export interface CreateRoomRequest {
  title: string;
  description?: string;
  visibility: RoomVisibility;
}

export interface CreateRoomResponse {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  joinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPublicRoomsResponse {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export type GetPublicRoomsPaginatedResponse =
  PaginatedResponse<GetPublicRoomsResponse>;

export interface PublicRoomsListParams {
  page?: number;
  limit?: number;
}

export interface MyRoomsListParams extends PublicRoomsListParams {
  search?: string;
}

export interface RoomMessageResponse {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  avatarUrl?: string;
  parentMessageId?: string;
  content: string;
  createdAt: string;
  isEdited?: boolean;
}

export interface RoomParticipantResponse {
  userId: string;
  name: string;
  avatarUrl?: string;
  role: RoomRole;
}

export interface JoinRoomSnapshotResponse {
  roomId: string;
  isNewParticipant: boolean;
  participants: RoomParticipantResponse[];
  messages: RoomMessageResponse[];
  onlineUserIds?: string[];
  activePoll?: RoomPollResponse | null;
  capabilities: Partial<Record<CapabilityKey, boolean>>;
  lifecycleStatus: RoomLifecycleStatus;
  featureSnapshot: RoomFeatureSnapshotResponse | null;
}

export interface CreateRoomMessageRequest {
  content: string;
  parentMessageId?: string;
}

export interface EditRoomMessageRequest {
  content: string;
}

export interface MessageEditedResponse {
  roomId: string;
  messageId: string;
  content: string;
}

export interface MessageDeletedResponse {
  roomId: string;
  messageId: string;
}

export interface CreatePollRequest {
  question: string;
  options: { text: string }[];
  allowMultiple?: boolean;
  expiresAt?: string;
}


export interface RoomPollResponse {
    id: string;
    question: string;
    createdBy: string;
    roomId: string;
    options: {
        id: string;
        text: string;
        votes: string[];
    }[];
    allowMultiple: boolean;
    isActive: boolean;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface SavePrivateNoteRequest {
  content: Record<string, unknown>;
  roomId: string;
}

export interface PrivateNoteResponse {
  id: string;
  roomId: string;
  userId: string;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SavePublicNoteRequest {
  content : string;
  roomId : string;
}

export interface GetPublicNoteRequest {
  roomId:string;
}

export interface PublicNoteResponse {
  id:string;
  roomId:string;
  userId:string;
  content:string;
  createdAt:string;
  updatedAt:string;
}

export type GetPublicNoteResponse = PublicNoteResponse | null
export type SavePublicNoteResponse = PublicNoteResponse;


export type GetPrivateNoteResponse = PrivateNoteResponse | null;
export type SavePrivateNoteResponse = PrivateNoteResponse;
