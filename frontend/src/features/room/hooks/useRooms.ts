import { useState, useEffect, useCallback } from 'react';
import { RoomService } from '../../../services/roomService';
import type { GetPublicRoomsPaginatedResponse, PublicRoomsListParams } from '../../../shared/types/api/room';

export const useRooms = (params?: PublicRoomsListParams) => {
    const [data, setData] = useState<GetPublicRoomsPaginatedResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await RoomService.getPublicRooms(params);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load rooms');
        } finally {
            setIsLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchRooms,
    };
};
