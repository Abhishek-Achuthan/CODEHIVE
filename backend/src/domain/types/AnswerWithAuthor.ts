import { AnswerEntity } from '../entities/qna/AnswerEntity';
import { AuthorInfo } from './AuthorInfo';

export interface AnswerWithAuthor {
    answer : AnswerEntity,
    author : AuthorInfo
}