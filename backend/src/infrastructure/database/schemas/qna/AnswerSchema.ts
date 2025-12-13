import { Document, Schema, Types } from 'mongoose';

export interface AnswerDoc extends Document {
  _id: Types.ObjectId;
  questionId: Types.ObjectId;
  answeredBy: Types.ObjectId;
  answerText: string;
  isAccepted: boolean;
  voteCount: number;
  editCount: number;
  version:number;
  lastEditedBy:Types.ObjectId | null;
  lastEditedAt:Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerLeanDoc {
  _id: Types.ObjectId;
  questionId: Types.ObjectId;
  answeredBy: Types.ObjectId;
  answerText: string;
  isAccepted: boolean;
  voteCount: number;
  editCount: number;
  version:number;
  lastEditedBy:Types.ObjectId | null;
  lastEditedAt:Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const AnswerSchema = new Schema<AnswerDoc>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answerText: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
    voteCount: { type: Number, default: 0 },
    lastEditedAt:{type:Date,default:null},
    lastEditedBy:{type:Schema.Types.ObjectId,ref:'User',default:null},
    editCount:{type:Number,default:0},
    version:{type:Number,default:1},
  },
  { timestamps: true }
);
