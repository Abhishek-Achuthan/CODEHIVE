import { useEffect, useState } from "react";
import { SessionService } from "../../../services/sessionService";
import type {
  BookedSessionsParams,
  BookedSessionResponse,
} from "../../../shared/types/api/session";
import { BaseError } from "../../../shared/errors/BaseError";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export function useFetchSessions(params?: BookedSessionsParams) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await SessionService.getBookedSessions(params);
      setSessions(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalItems || 0);
    } catch (err: unknown) {
      const normalized =
        err instanceof BaseError
          ? err
          : new BaseError(APP_MESSAGES.SESSION.LOAD_FAILED);

      setError(normalized.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSessions();
  }, [
    params?.role,
    params?.page,
    params?.limit,
    params?.filter?.status,
    params?.filter?.dateFrom,
    params?.filter?.dateTo,
    params?.filter?.paymentSource,
    params?.filter?.refundableNow,
    params?.search,
  ]);

  return {
    sessions,
    totalPages,
    totalItems,
    loading,
    error,
    refetch: fetchSessions,
  };
}
