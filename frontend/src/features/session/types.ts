export interface AvailabilityFormData {
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    isRecurring: boolean;
    date?: string;
    slotPrice: number;
}