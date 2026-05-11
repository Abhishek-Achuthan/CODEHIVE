import type { PaginatedResponse } from "../core/api";
export type RoomVisibility = "PUBLIC_REQUEST" | "PRIVATE";

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

export type GetPublicRoomsPaginatedResponse = PaginatedResponse<GetPublicRoomsResponse>;

export interface PublicRoomsListParams {
    page?: number;
    limit?: number;
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
    role: string;
}

export interface JoinRoomSnapshotResponse {
    roomId: string;
    isNewParticipant: boolean;
    participants: RoomParticipantResponse[];
    messages: RoomMessageResponse[];
    onlineUserIds?: string[];
}

export interface CreateRoomMessageRequest {
    content: string;
    parentMessageId?: string;
}

export interface EditRoomMessageRequest {
    content: string;
}

export interface MessageEditedResponse {
    messageId: string;
    content: string;
}

export interface MessageDeletedResponse {
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
        id?: string;
        text: string;
        votes: string[];
    }[];
    allowMultiple?: boolean;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt?: string;
}
