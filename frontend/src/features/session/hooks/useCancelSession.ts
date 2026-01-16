import { useState } from "react";
import { SessionService } from "../../../services/sessionService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useCancelSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelSession(sessionId: string): Promise<void> {
    if (!sessionId) {
      throw new Error("sessionId is required");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await SessionService.cancelSession(sessionId);

      if (!response) {
        throw new Error("Failed to cancel session");
      }

      toast.success("Session cancelled successfully");
    } catch (err) {
      const message =
        err instanceof BaseError
          ? err.message
          : "Something went wrong while cancelling the session";

      setError(message);
      toast.error(message);

      throw err; 
    } finally {
      setLoading(false);
    }
  }

  return { cancelSession, loading, error };
}
