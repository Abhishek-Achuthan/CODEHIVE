import { useEffect, useState } from "react";
import { MentorshipService } from "../../../services/mentorService";
import type { AvailableSlotResponse } from "../../../shared/types/api/mentor";
import { BaseError } from "../../../shared/errors/BaseError";

interface UseFetchSlotsResult {
  slots: AvailableSlotResponse[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export const useFetchSlots = (
  mentorId: string | undefined,
  selectedDate: Date | null,
  enabled = true
): UseFetchSlotsResult => {
  const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    if (!enabled || !mentorId || !selectedDate) {
      setSlots([]);
      setError(null);
      return;
    }

    const fetchSlots = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const offset = selectedDate.getTimezoneOffset();
        const date = new Date(
          selectedDate.getTime() - offset * 60 * 1000
        );
        const dateStr = date.toISOString().split("T")[0];

        const data = await MentorshipService.getAvailability(
          mentorId,
          dateStr
        );

        setSlots(data);
      } catch (err: unknown) {
        if (err instanceof BaseError) {
          setError(err.message);
        } else {
          setError("Failed to fetch slots");
        }
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSlots();
  }, [enabled, mentorId, selectedDate, retryCount]);

  return {
    slots,
    isLoading,
    error,
    retry: () => setRetryCount((count) => count + 1),
  };
};
