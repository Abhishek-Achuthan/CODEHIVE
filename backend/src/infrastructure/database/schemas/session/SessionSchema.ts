import {Document, Schema } from 'mongoose';

export interface SessionDoc extends Document  {
    id:Schema.Types.ObjectId,
    userId:string;
    mentorId:string;
    date:string;
    startTime:string;
    endTime:string;
    status:'upcoming' | 'completed' | 'cancelled'; 
    topic:string;
    createdAt:Date;
    updatedAt:Date;

}


export const SessionSchema = new Schema({
    mentorId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    topic: { type: String, required: true },
}, {
    timestamps: true
});

