import { Document,Schema,Types } from 'mongoose';

export interface SavedQuestionDoc extends Document {
    _id: Types.ObjectId;
    userId:Types.ObjectId;
    questionId:Types.ObjectId;
    createdAt:Date,
    updatedAt:Date,
    savedAt:Date;
}

export const SavedQuestionSchema = new Schema<SavedQuestionDoc>({
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},
    questionId:{type:Schema.Types.ObjectId,ref:'Question',required:true,index:true},
    savedAt:{type:Date,default:() => new Date()},
},{timestamps:true}
)