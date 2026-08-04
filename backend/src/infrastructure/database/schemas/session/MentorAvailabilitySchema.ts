import { Schema, Document, Types } from 'mongoose';
import { SessionType } from '../../../../domain/types/SessionType';

export interface MentorAvailabilityDoc extends Document {
    mentorId: Types.ObjectId;
    rrule: string;
    exdates: string[];
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    bufferMinutes: number;
    slotPrice: number;
    sessionType: SessionType;
    maxGuests: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const MentorAvailabilitySchema = new Schema<MentorAvailabilityDoc>(
    {
        mentorId: { type: Schema.Types.ObjectId, required: true, index: true },
        rrule: { type: String, required: true },
        exdates: { type: [String], default: [] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        slotDurationMinutes: { type: Number, required: true },
        bufferMinutes: { type: Number, default: 0 },
        slotPrice: { type: Number, required: true },
        sessionType: { type: String, enum: Object.values(SessionType), required: true, default: SessionType.ONE_TO_ONE },
        maxGuests: { type: Number, required: true, default: 0, min: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

MentorAvailabilitySchema.index({ mentorId: 1, isActive: 1, slotPrice: 1 });
