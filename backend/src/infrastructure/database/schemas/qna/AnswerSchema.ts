import { Schema, Types } from 'mongoose';

export interface AnswerDoc {
  questionId:Types.ObjectId,
  answeredBy:Types.ObjectId,
  answerText:string,
  isAccepted:boolean,
  voteCount:number
}

export const AnswerSchema = new Schema<AnswerDoc>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    answeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answerText: { type: String, required: true },
    isAccepted:{type:Boolean,default:false},
    voteCount:{type:Number,default:0},
  },
  { timestamps: true }
);
