// Session/Availability types
export interface AvailabilityFormData {
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    isRecurring: boolean;
    date?: string;
    slotPrice: number;

    // Recurring-specific fields
    selectedDays?: string[]; // ['MO', 'WE', 'FR']
    durationType?: 'forever' | 'until' | 'count';
    endDate?: string; // YYYY-MM-DD for 'until' type
    occurrenceCount?: number; // For 'count' type
}
