import { AxiosError } from "axios";
import * as RoomAPI from "../api/endpoints/roomAPI";
import { BaseError } from "../shared/errors/BaseError";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  GetPrivateNoteResponse,
  GetPublicRoomsPaginatedResponse,
  MyRoomsListParams,
  PublicRoomsListParams,
  SavePrivateNoteResponse,
  RoomVisibility,
} from "../shared/types/api/room";
import type { RoomSettingsResponse } from "../shared/types/api/roomSettings";
import type { RoomInviteResponse } from "../shared/types/api/roomInvite";
import { APP_MESSAGES } from "../shared/constants/messages";

export class RoomService {
  static async createRoom(
    data: CreateRoomRequest,
  ): Promise<CreateRoomResponse> {
    try {
      const response = await RoomAPI.createRoom(data);
      return response.data as CreateRoomResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getPublicRooms(
    params?: PublicRoomsListParams,
  ): Promise<GetPublicRoomsPaginatedResponse> {
    try {
      const response = await RoomAPI.getPublicRooms(params);
      return response.data as GetPublicRoomsPaginatedResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getMyRooms(
    params?: MyRoomsListParams,
  ): Promise<GetPublicRoomsPaginatedResponse> {
    try {
      const response = await RoomAPI.getMyRooms(params);
      return response.data as GetPublicRoomsPaginatedResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getRoomSettings(roomId: string): Promise<RoomSettingsResponse> {
    try {
      const response = await RoomAPI.getRoomSettings(roomId);
      return response.data as RoomSettingsResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateRoomDetails(roomId: string, data: { title?: string, description?: string, visibility?: RoomVisibility }): Promise<RoomSettingsResponse> {
    try {
      const response = await RoomAPI.updateRoomDetails(roomId, data);
      return response.data as RoomSettingsResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async createRoomInvite(roomId: string): Promise<RoomInviteResponse> {
    try {
      const response = await RoomAPI.createRoomInvite(roomId);
      return response.data as RoomInviteResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async regenerateRoomInvite(roomId: string): Promise<RoomInviteResponse> {
    try {
      const response = await RoomAPI.regenerateRoomInvite(roomId);
      return response.data as RoomInviteResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async revokeRoomInvite(roomId: string, inviteId: string = "active"): Promise<void> {
    try {
      await RoomAPI.revokeRoomInvite(roomId, inviteId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async kickParticipant(roomId: string, userId: string): Promise<void> {
    try {
      await RoomAPI.kickParticipant(roomId, userId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async reportParticipant(roomId: string, userId: string, reason: string, description?: string): Promise<void> {
    try {
      await RoomAPI.reportParticipant(roomId, userId, { reason, description });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async endRoom(roomId: string): Promise<void> {
    try {
      await RoomAPI.endRoom(roomId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateParticipantOverrides(
    roomId: string,
    userId: string,
    overrides: Record<string, boolean>,
  ): Promise<{ userId: string; overrides: Record<string, boolean> }> {
    try {
      const response = await RoomAPI.updateParticipantOverrides(roomId, userId, overrides);
      return response.data as { userId: string; overrides: Record<string, boolean> };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getPrivateNote(roomId: string): Promise<GetPrivateNoteResponse> {
    try {
      const response = await RoomAPI.getPrivateNote(roomId);
      return response.data as GetPrivateNoteResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async savePrivateNote(
    roomId: string,
    content: Record<string, unknown>,
  ): Promise<SavePrivateNoteResponse> {
    try {
      const response = await RoomAPI.savePrivateNote(roomId, content);
      return response.data as SavePrivateNoteResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getPublicNote(roomId: string) {
    try {
      const response = await RoomAPI.getPublicNote(roomId);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async savePublicNote(roomId: string, content: string) {
    try {
      const response = await RoomAPI.savePublicNote(roomId, content);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getClosedPoll(roomId: string) {
    try {
      const response = await RoomAPI.getClosedPoll(roomId);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const msg =
        error.response?.data.message ||
        APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
      const status = error.response?.status;
      throw new BaseError(msg, status);
    }
    if (error instanceof Error) {
      throw new BaseError(error.message);
    }
    throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
  }
}
