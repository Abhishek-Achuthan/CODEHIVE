import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type {
    CreatePollRequest,
    CreateRoomMessageRequest,
    CreateRoomRequest,
    EditRoomMessageRequest,
    PublicRoomsListParams,
} from "../../shared/types/api/room";

export const createRoom = (data: CreateRoomRequest) =>
    apiClient.post(API_ROUTES.ROOM.CREATE_ROOM, data);

export const getPublicRooms = (params?: PublicRoomsListParams) =>
    apiClient.get(API_ROUTES.ROOM.GET_PUBLIC_ROOMS(params));

export const joinRoom = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.JOIN_ROOM(roomId));

export const leaveRoom = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.LEAVE_ROOM(roomId));

export const createMessage = (roomId: string, data: CreateRoomMessageRequest) =>
    apiClient.post(API_ROUTES.ROOM.CREATE_MESSAGE(roomId), data);

export const editMessage = (
    roomId: string,
    messageId: string,
    data: EditRoomMessageRequest
) => apiClient.patch(API_ROUTES.ROOM.EDIT_MESSAGE(roomId, messageId), data);

export const deleteMessage = (roomId: string, messageId: string) =>
    apiClient.delete(API_ROUTES.ROOM.DELETE_MESSAGE(roomId, messageId));

export const createPoll = (roomId: string, data: CreatePollRequest) =>
    apiClient.post(API_ROUTES.ROOM.CREATE_POLL(roomId), data);

export const votePoll = (roomId: string, pollId: string, optionIds: string[]) =>
    apiClient.post(API_ROUTES.ROOM.VOTE_POLL(roomId, pollId), { optionIds });

export const closePoll = (roomId: string, pollId: string) =>
    apiClient.patch(API_ROUTES.ROOM.CLOSE_POLL(roomId, pollId));
