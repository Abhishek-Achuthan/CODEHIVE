import { Document, Schema, Types } from 'mongoose';
import { VoteType } from '../../../../domain/types/VoteType';

export interface VoteDoc extends Document{
  userId:Types.ObjectId,
  targetId:Types.ObjectId,
  targetType:VoteType,
  value:number
}

export const VoteSchema = new Schema<VoteDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: Object.values(VoteType), required: true },
    value: { type: Number, enum: [1, -1], required:true},  
  },
  { timestamps: true }
);
