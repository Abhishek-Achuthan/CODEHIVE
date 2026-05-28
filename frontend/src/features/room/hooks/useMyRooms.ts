import { useState, useEffect, useCallback } from "react";
import { RoomService } from "../../../services/roomService";
import type {
  GetPublicRoomsPaginatedResponse,
  PublicRoomsListParams,
} from "../../../shared/types/api/room";

const DEFAULT_LIMIT = 5;

export const useMyRooms = (
  page: number,
  enabled = true,
  limit = DEFAULT_LIMIT,
) => {
  const [data, setData] = useState<GetPublicRoomsPaginatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params: PublicRoomsListParams = { page, limit };

  const fetchRooms = useCallback(async () => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await RoomService.getMyRooms(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your rooms");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, page, limit]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRooms,
    totalPages: data?.totalPages ?? 1,
    totalItems: data?.totalItems ?? 0,
    currentPage: page,
  };
};

export const MY_ROOMS_PAGE_SIZE = DEFAULT_LIMIT;
