import { RoomAdmissionPolicy } from '../../domain/types/RoomAdmissionPolicy';
import { RoomLifeCycleStatus } from '../../domain/types/RoomLifeCycleStatus';
import { RoomVisibility } from '../../domain/types/RoomVisibility';
import { CapabilityKey } from '../../domain/types/CapabilityKey';
import { RoomFeatureSnapshot } from '../../domain/entities/room/RoomEntity';

export interface CreateRoomDTO {
  title: string;
  description?: string;
  visibility: RoomVisibility;
  userId: string,
}

export interface CreateRoomResponseDTO {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  admissionPolicy: RoomAdmissionPolicy;
  lifecycleStatus: RoomLifeCycleStatus;
  joinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JoinRoomDTO {
  roomId: string;
  userId: string;
  inviteCode?: string;
}

export interface RoomInviteResponseDTO {
  id: string;
  roomId: string;
  joinUrl: string;
  type: string;
  expiresAt?: string;
  maxUses?: number;
  useCount: number;
  revokedAt?: string;
  createdAt: string;
}

export interface InvitePreviewResponseDTO {
  roomId: string;
  title: string;
  hostName: string;
  isFull: boolean;
  canJoin: boolean;
}

export interface JoinViaInviteDTO {
  inviteCode: string;
  userId: string;
}

export interface KickParticipantDTO {
  roomId: string;
  hostUserId: string;
  targetUserId: string;
}

export interface JoinRoomResponseDTO {
  id: string;
  roomId: string;
  userId: string;
  role: string;
  joinedAt: Date;
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
  capabilities: Partial<Record<CapabilityKey, boolean>>;
  lifecycleStatus: RoomLifeCycleStatus;
  featureSnapshot: RoomFeatureSnapshot | null;
}

export interface GetPublicRoomsDTO {
  page: number;
  limit: number;
}

export interface GetPublicRoomsResponseDTO {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  createdAt: Date;
  updatedAt: Date;
}
