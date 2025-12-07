import { QuestionEntity } from '../entities/qna/QuestionEntity';

export interface AuthorInfo {
        id:string;
        firstName:string;
        lastName:string;
        email:string;
}

export interface QuestionWithAuthor {
    question:QuestionEntity;
    author: AuthorInfo;
}