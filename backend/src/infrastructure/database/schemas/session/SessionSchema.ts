import { Types } from 'mongoose';
import { Document, Schema } from 'mongoose';
import { SessionStatus } from '../../../../domain/types/SessionStatus';

export interface SessionDoc extends Document  {
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId;
    mentorId: Schema.Types.ObjectId;
    date:string;
    startTime:Date;
    endTime:Date;
    status: SessionStatus; 
    amountPaid:number;
    refunded:boolean
    topic:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface SessionLeanDoc{
    _id:Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId;
    mentorId: Schema.Types.ObjectId;
    date:string;
    startTime:Date;
    endTime:Date;
    status: SessionStatus; 
    refunded:boolean;
    amountPaid:number;
    topic:string;
    createdAt:Date;
    updatedAt:Date;
}


export const SessionSchema = new Schema({
    mentorId: { type: Types.ObjectId, ref: 'User', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    startTime: { type: Date, required: true },
    amountPaid:{type:Number,required:true},
    refunded:{type : Boolean, default : false},
    endTime: { type: Date, required: true },
    status: { type: String, enum: Object.values(SessionStatus), default: SessionStatus.UPCOMING },
    topic: { type: String, required: true },
}, {
    timestamps: true
});
