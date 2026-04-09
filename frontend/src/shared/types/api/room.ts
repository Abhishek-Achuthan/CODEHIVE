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
