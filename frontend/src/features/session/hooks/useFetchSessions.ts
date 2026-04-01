import { useEffect, useState } from "react";
import { SessionService } from "../../../services/sessionService";
import type {
  BookedSessionResponse,
  SessionPerspective,
} from "../../../shared/types/api/session";
import { BaseError } from "../../../shared/errors/BaseError";

export function useFetchSessions(perspective: SessionPerspective = "user") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await SessionService.getBookedSessions(perspective);
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
  }, [perspective]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
  };
}
