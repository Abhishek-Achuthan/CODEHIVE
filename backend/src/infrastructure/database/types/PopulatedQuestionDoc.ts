import { QuestionLeanDoc } from '../schemas/qna/QuestionSchema';
import { UserLeanDoc } from '../schemas/UserSchema';

export type PopulatedQuestionDoc = Omit<QuestionLeanDoc,'askedBy'> & {
    askedBy:UserLeanDoc
}