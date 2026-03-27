import { useEffect, useState } from "react";
import { MentorshipService } from "../../../services/mentorService";
import type { AvailableSlotResponse } from "../../../shared/types/api/mentor";
import { BaseError } from "../../../shared/errors/BaseError";

interface UseFetchSlotsResult {
  slots: AvailableSlotResponse[];
  isLoading: boolean;
  error: string | null;
}

export const useFetchSlots = (
  mentorId: string | undefined,
  selectedDate: Date | null
): UseFetchSlotsResult => {
  const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId || !selectedDate) {
      setSlots([]);
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

    fetchSlots();
  }, [mentorId, selectedDate]);

  return { slots, isLoading, error };
};