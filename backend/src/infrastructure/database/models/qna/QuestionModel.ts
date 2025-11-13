import { Model,model } from 'mongoose';
import { QuestionDoc, QuestionSchema } from '../../schemas/qna/QuestionSchema';


const QuestionModel:Model<QuestionDoc> = model<QuestionDoc>('Question',QuestionSchema);
export default QuestionModel
