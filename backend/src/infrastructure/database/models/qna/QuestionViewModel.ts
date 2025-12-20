import { Model, model } from 'mongoose';
import { QuestionViewDoc, QuestionViewSchema } from '../../schemas/qna/QuestionViewSchema';

const QuestionViewModel: Model<QuestionViewDoc> = model<QuestionViewDoc>(
  'QuestionView',
  QuestionViewSchema
);
export default QuestionViewModel;
