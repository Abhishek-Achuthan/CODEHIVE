import { useEffect, useMemo, useRef, useState } from "react";
import { RoomService } from "../../../services/roomService";
import type {
  GetPublicRoomsPaginatedResponse,
  RoomVisibility,
} from "../../../shared/types/api/room";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { MyRoomsVisibilityFilter } from "../components/MyRoomsVisibilityTabs";

const DEFAULT_LIMIT = 5;
const SEARCH_DEBOUNCE_MS = 500;

export const MY_ROOMS_PAGE_SIZE = DEFAULT_LIMIT;

function visibilityFilterToRoomVisibility(
  filter: MyRoomsVisibilityFilter,
): RoomVisibility | null {
  if (filter === "private") return "PRIVATE";
  if (filter === "public") return "PUBLIC_REQUEST";
  return null;
}

function useEffectiveSearch(searchTerm: string, delay: number): string {
  const trimmed = searchTerm.trim();
  const debounced = useDebounce(trimmed, delay);
  return trimmed === "" ? "" : debounced;
}

export function useMyRooms(enabled: boolean) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const effectiveSearch = useEffectiveSearch(searchTerm, SEARCH_DEBOUNCE_MS);

  const [currentPage, setCurrentPage] = useState(1);
  const [visibility, setVisibility] = useState<MyRoomsVisibilityFilter>("all");

  const [data, setData] = useState<GetPublicRoomsPaginatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevEffectiveSearchRef = useRef(effectiveSearch);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const searchChanged =
      prevEffectiveSearchRef.current !== effectiveSearch;
    prevEffectiveSearchRef.current = effectiveSearch;

    if (searchChanged && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    const fetchRooms = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await RoomService.getMyRooms({
          page: currentPage,
          limit: DEFAULT_LIMIT,
          search: effectiveSearch || undefined,
          dateFrom: dateFilter || undefined,
          status: statusFilter || undefined,
        });
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your rooms",
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRooms();
  }, [enabled, currentPage, effectiveSearch, dateFilter, statusFilter]);

  const rooms = useMemo(() => {
    if (!data) return data;
    if (effectiveSearch) return data;

    const roomVisibility = visibilityFilterToRoomVisibility(visibility);
    if (!roomVisibility) return data;

    return {
      ...data,
      items: data.items.filter((room) => room.visibility === roomVisibility),
    };
  }, [data, visibility, effectiveSearch]);

  const setVisibilityFilter = (next: MyRoomsVisibilityFilter) => {
    setVisibility(next);
    setCurrentPage(1);
  };

  const resetSearch = () => setSearchTerm("");

  const isSearchPending =
    searchTerm.trim() !== "" && searchTerm.trim() !== effectiveSearch;

  return {
    rooms,
    isLoading: isLoading || isSearchPending,
    error,
    searchTerm,
    setSearchTerm,
    debouncedSearch: effectiveSearch,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    visibility,
    setVisibility: setVisibilityFilter,
    resetSearch,
    refetch: async () => {
      if (!enabled) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await RoomService.getMyRooms({
          page: currentPage,
          limit: DEFAULT_LIMIT,
          search: effectiveSearch || undefined,
          dateFrom: dateFilter || undefined,
          status: statusFilter || undefined,
        });
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your rooms",
        );
      } finally {
        setIsLoading(false);
      }
    },
    totalPages: data?.totalPages ?? 1,
    totalItems: data?.totalItems ?? 0,
  };
}
