import { RoomVisibility } from "../../domain/types/RoomVisisblity";

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
    
