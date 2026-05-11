import { RoomVisibility } from '../../domain/types/RoomVisisblity';

export interface CreateRoomDTO {
    title: string;
    description?:string;
    visibility:RoomVisibility;
    userId:string,
}

export interface CreateRoomResponseDTO {
    id:string;
    title:string;
    description?:string;
    visibility:RoomVisibility;
    hostId:string;
    maxParticipants:number;
    participantCount:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface JoinRoomDTO {
    roomId:string;
    userId:string;
}

export interface JoinRoomResponseDTO {
    id:string;
    roomId:string;
    userId:string;
    role:string;
    joinedAt:Date;
}

export interface ParticipantWithUserDTO {
    userId: string;
    name: string;
    avatarUrl?: string;
    role: string;
}

import { SendMessageResponseDTO } from './MessageDTO';
import { ICreatePollOutputDTO } from './PollDTO';

export interface JoinRoomSnapshotDTO {
    roomId: string;
    isNewParticipant: boolean;
    participants: ParticipantWithUserDTO[];
    messages: SendMessageResponseDTO[];
    activePoll?: ICreatePollOutputDTO | null;
}

export interface GetPublicRoomsDTO {
    page:number;
    limit:number;
}

export interface GetPublicRoomsResponseDTO {
    id:string;
    title:string;
    description?:string;
    visibility:RoomVisibility;
    hostId:string;
    maxParticipants:number;
    participantCount:number;
    createdAt:Date;
    updatedAt:Date;
}

    
