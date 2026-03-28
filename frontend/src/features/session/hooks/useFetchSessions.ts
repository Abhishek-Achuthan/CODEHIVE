import { useEffect, useState } from "react";
import { SessionService } from "../../../services/sessionService";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { BaseError } from "../../../shared/errors/BaseError";

export function useFetchSessions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await SessionService.getBookedSessions();
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
  }, []);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
  };
}