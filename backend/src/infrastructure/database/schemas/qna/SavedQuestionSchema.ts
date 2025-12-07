import { Document,Schema,Types } from 'mongoose';

export interface SavedQuestionDoc extends Document {
    _id: Types.ObjectId;
    userId:Types.ObjectId;
    questionId:Types.ObjectId;
    createdAt:Date,
    updatedAt:Date,
}

export const SavedQuestionSchema = new Schema<SavedQuestionDoc>({
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},
    questionId:{type:Schema.Types.ObjectId,ref:'Question',required:true,index:true},
},{timestamps:true}
);

SavedQuestionSchema.index({userId:1,questionId:1},{unique:true});