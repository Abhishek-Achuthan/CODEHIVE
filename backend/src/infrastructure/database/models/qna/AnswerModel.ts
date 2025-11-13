import { AnswerSchema } from '../../schemas/qna/AnswerSchema';
import { Model,model } from 'mongoose';
import { AnswerDoc } from '../../schemas/qna/AnswerSchema';

const AnswerModel:Model<AnswerDoc>=model<AnswerDoc>('Answer',AnswerSchema);
export default AnswerModel