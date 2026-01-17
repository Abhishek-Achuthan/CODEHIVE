import { useState } from "react";
import { MentorshipService } from "../../../services/mentorService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { AvailableSlotResponse } from "../../../shared/types/api/mentor";

export function useFetchSlots() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);

    async function fetchSlots(id: string, date: string): Promise<void> {
        setLoading(true);
        setError(null);

        try {
            const data = await MentorshipService.getAvailability(id, date);
           
            setSlots(data ?? []);
        } catch (err: unknown) {
            if (err instanceof BaseError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unexpected error occurred");
            }

            setSlots([]);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, slots, fetchSlots };
}
