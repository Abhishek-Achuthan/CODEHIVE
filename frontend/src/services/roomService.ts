import { AxiosError } from "axios";
import * as RoomAPI from "../api/endpoints/roomAPI";
import { BaseError } from "../shared/errors/BaseError";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  GetPrivateNoteResponse,
  GetPublicRoomsPaginatedResponse,
  PublicRoomsListParams,
  SavePrivateNoteResponse,
} from "../shared/types/api/room";
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
