import { Model,model } from 'mongoose';
import { SavedQuestionDoc,SavedQuestionSchema } from '../../schemas/qna/SavedQuestionSchema';

const SavedQuestionModel:Model<SavedQuestionDoc> = model<SavedQuestionDoc>('SavedQuestion',SavedQuestionSchema);
export default SavedQuestionModel