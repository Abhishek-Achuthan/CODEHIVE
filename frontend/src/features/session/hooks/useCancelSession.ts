import { useState } from "react";
import { SessionService } from "../../../services/sessionService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export function useCancelSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelSession(
    sessionId: string,
    options?: { successMessage?: string }
  ): Promise<void> {
    if (!sessionId) {
      throw new BaseError(APP_MESSAGES.SESSION.SESSION_ID_REQUIRED);
    }

    try {
      setLoading(true);
      setError(null);

      const response = await SessionService.cancelSession(sessionId);

      if (!response) {
        throw new Error(APP_MESSAGES.SESSION.CANCEL_FAILED);
      }

      toast.success(options?.successMessage ?? APP_MESSAGES.SESSION.CANCEL_SUCCESS);
    } catch (err) {
      const message =
        err instanceof BaseError
          ? err.message
          : APP_MESSAGES.SESSION.CANCEL_ERROR;

      setError(message);
      toast.error(message);

      throw err; 
    } finally {
      setLoading(false);
    }
  }

  return { cancelSession, loading, error };
}
