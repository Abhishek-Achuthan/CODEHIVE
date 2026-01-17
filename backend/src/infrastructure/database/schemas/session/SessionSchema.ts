import { Types } from 'mongoose';
import { Document, Schema } from 'mongoose';
import { SessionStatus } from '../../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../../domain/types/PaymentSource';

export interface SessionDoc extends Document {
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId;
    mentorId: Schema.Types.ObjectId;
    date: string;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    paymentSource: PaymentSource;
    paymentStatus: SessionPaymentStatus;
    paymentReferenceId: string | null;
    amount: number;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SessionLeanDoc {
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId;
    mentorId: Schema.Types.ObjectId;
    date: string;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    paymentSource: PaymentSource;
    paymentStatus: SessionPaymentStatus;
    paymentReferenceId: string | null;
    amount: number;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
}


export const SessionSchema = new Schema({
    mentorId: { type: Types.ObjectId, ref: 'User', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    startTime: { type: Date, required: true },
    amount: { type: Number, required: true },
    endTime: { type: Date, required: true },
    paymentStatus: { type: String, enum: Object.values(SessionPaymentStatus), default: SessionPaymentStatus.PENDING },
    paymentSource: { type: String, enum: Object.values(PaymentSource) },
    paymentReferenceId: { type: String, default: null },
    status: { type: String, enum: Object.values(SessionStatus), default: SessionStatus.UPCOMING },
    topic: { type: String, required: true },
}, {
    timestamps: true
});

// Unique constraint to prevent double booking of the same slot
// Only applies to non-cancelled sessions
SessionSchema.index(
    { mentorId: 1, date: 1, startTime: 1, endTime: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $ne: SessionStatus.CANCELLED }
        }
    }
);
