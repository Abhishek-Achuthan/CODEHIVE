import { Document, Schema, Types } from 'mongoose';
import { VoteTargetType } from '../../../../domain/types/VoteTargetType';

export interface VoteDoc extends Document{
  _id: Types.ObjectId,
  userId:Types.ObjectId,
  targetId:Types.ObjectId,
  targetType:VoteTargetType,
  value:number,
  createdAt: Date,
  updatedAt: Date,
}

export const VoteSchema = new Schema<VoteDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: Object.values(VoteTargetType), required: true },
    value: { type: Number, enum: [1, -1], required:true},  
  },
  { timestamps: true }
);

VoteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
