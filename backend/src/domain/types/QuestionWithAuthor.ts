import { QuestionEntity } from '../entities/qna/QuestionEntity';
import { AuthorInfo } from './AuthorInfo';

export interface QuestionWithAuthor {
    question:QuestionEntity;
    author: AuthorInfo;
}