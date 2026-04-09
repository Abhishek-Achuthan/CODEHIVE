import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreateRoomRequest, PublicRoomsListParams } from "../../shared/types/api/room";

export const createRoom = (data: CreateRoomRequest) =>
    apiClient.post(API_ROUTES.ROOM.CREATE_ROOM, data);

export const getPublicRooms = (params?: PublicRoomsListParams) =>
    apiClient.get(API_ROUTES.ROOM.GET_PUBLIC_ROOMS(params));
