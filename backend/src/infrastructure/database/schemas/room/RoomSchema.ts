import { Document, Schema, Types } from 'mongoose';
import { RoomType } from '../../../../domain/types/RoomType';
import { RoomStatus } from '../../../../domain/types/RoomStatus';
import { RoomParticipant } from '../../../../domain/types/RoomParticipant';
import { UserRole } from '../../../../domain/types/UserRole';


export interface RoomDoc extends Document {
    _id: Types.ObjectId;
    type: RoomType;
    ownerId: Types.ObjectId;
    sessionId?: Types.ObjectId;
    mentorId?: Types.ObjectId;
    status: RoomStatus;
    participants: RoomParticipant[];
    createdAt: Date;
    startedAt?: Date | null;
    endedAt?: Date | null;
}


export interface RoomLeanDoc {
    _id: Types.ObjectId;
    type: RoomType;
    ownerId: Types.ObjectId;
    sessionId?: Types.ObjectId;
    mentorId?: Types.ObjectId;
    status: RoomStatus;
    participants: RoomParticipant[];
    createdAt: Date;
    startedAt?: Date | null;
    endedAt?: Date | null;
}

export const RoomSchema: Schema<RoomDoc> = new Schema(
    {
        type: {
            type: String,
            enum: Object.values(RoomType),
            required: true,
        },

        ownerId: { type: Schema.Types.ObjectId, required: true },

        sessionId: { type: Schema.Types.ObjectId, default: null },

        mentorId: { type: Schema.Types.ObjectId, default: null },

        participants: {
            type: [
                {
                    userId: { type: Schema.Types.ObjectId, required: true },
                    role: { type: String, enum: Object.values(UserRole), required: true },
                    joinedAt: { type: Date },
                    leftAt: { type: Date },
                },
            ],
            default: [],
        },

        status: {
            type: String,
            enum: Object.values(RoomStatus),
            required: true,
        },

        createdAt: { type: Date, required: true },

        startedAt: { type: Date, default: null },

        endedAt: { type: Date, default: null },
    },
    {}
);
