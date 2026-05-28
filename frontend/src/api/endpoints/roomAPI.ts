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

export const getMyRooms = (params?: PublicRoomsListParams) =>
    apiClient.get(API_ROUTES.ROOM.GET_MY_ROOMS(params));

export const getRoomSettings = (roomId: string) =>
    apiClient.get(API_ROUTES.ROOM.GET_SETTINGS(roomId));

export const joinRoom = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.JOIN_ROOM(roomId));

export const leaveRoom = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.LEAVE_ROOM(roomId));

export const createRoomInvite = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.CREATE_INVITE(roomId));

export const regenerateRoomInvite = (roomId: string) =>
    apiClient.post(API_ROUTES.ROOM.REGENERATE_INVITE(roomId));

export const kickParticipant = (roomId: string, userId: string) =>
    apiClient.post(API_ROUTES.ROOM.KICK_PARTICIPANT(roomId, userId));

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

export const getPrivateNote = (roomId: string) =>
    apiClient.get(API_ROUTES.ROOM.GET_PRIVATE_NOTE(roomId));

export const savePrivateNote = (roomId: string, content: Record<string, unknown>) =>
    apiClient.put(API_ROUTES.ROOM.SAVE_PRIVATE_NOTE(roomId), { content });

export const getPublicNote = (roomId: string) => 
    apiClient.get(API_ROUTES.ROOM.GET_PUBLIC_NOTE(roomId));

export const savePublicNote = (roomId: string, content: string) =>
    apiClient.put(API_ROUTES.ROOM.SAVE_PUBLIC_NOTE(roomId), { content });

