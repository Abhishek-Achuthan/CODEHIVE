import { Schema, Types } from 'mongoose';

export interface QuestionDoc {
  title:string,
  description:string,
  isAnswered:boolean,
  answerCount:number,
  askedBy:Types.ObjectId,
  tags:string[],
  views:number,
  votes:number
}

export const QuestionSchema = new Schema<QuestionDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isAnswered: { type: Boolean, default: false },
    answerCount:{type:Number,default:0},
    askedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], required: true },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
