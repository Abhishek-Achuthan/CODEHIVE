import { useEffect, useState } from "react";
import { SessionService } from "../../../services/sessionService";
import type {
  BookedSessionsParams,
  BookedSessionResponse,
} from "../../../shared/types/api/session";
import { BaseError } from "../../../shared/errors/BaseError";

export function useFetchSessions(params?: BookedSessionsParams) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await SessionService.getBookedSessions(params);
      setSessions(res);
    } catch (err: unknown) {
      const normalized =
        err instanceof BaseError
          ? err
          : new BaseError("Failed to load sessions");

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
  ]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
  };
}
