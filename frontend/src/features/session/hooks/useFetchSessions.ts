import { useEffect, useState } from "react";
import { SessionService } from "../../../services/sessionService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { BookedSessionResponse } from "../../../shared/types/api/session";

export function useFetchSessions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sessions, setSessions] = useState<BookedSessionResponse[]>([]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await SessionService.getBookedSessions();
      setSessions(response);
    } catch (err: unknown) {
      if (err instanceof BaseError) {
        setError(err.message);
      } else {
        setError("Failed to load sessions");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, loading, error, fetchSessions };
}
