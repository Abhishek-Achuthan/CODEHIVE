import { AxiosError } from 'axios';

import * as QnAApi from '../api/endpoints/qnaAPI'

import { BaseError } from '../shared/errors/BaseError'
import type { AnswerListParams, CreateQuestionRequest, QuestionListParams } from '../shared/types/api/qna';
import { mapQuestionListItemFromApi, mapRelatedQuestionFromApi, mapAnswerFromApi } from '../shared/types/domain/qna';


export class QnAService {
    static async listQuestions(data: QuestionListParams) {
        try {
            const response = await QnAApi.listQuestion(data);
            console.log(response)
            return {
                ...response.data,
                items: response.data.data.items.map(mapQuestionListItemFromApi),
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    static async createQuestion(data: CreateQuestionRequest) {
        try {
            const response = await QnAApi.createQuestion(data);
            return response.data;
        }catch(error) {
            this.handleError(error);
        }
    }

    static async getQuestion(questionId:string) {
        try {
            const response = await QnAApi.getQuestion(questionId);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async relatedQuestions(questionId: string) {
        try {
            const response = await QnAApi.relatedQuestions(questionId);
            return {
                ...response.data,
                items: response.data.items.map(mapRelatedQuestionFromApi),
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    static async saveQuestion(questionId:string) {
        try {
            const response = await QnAApi.saveQuestion(questionId);
            return response.data
        } catch (error) {
            this.handleError(error);
        }
    }

    static async postAnswer(data:{questionId:string,answerText:string}) {
        try {
            const response = await QnAApi.postAnswer(data);
            return response.data
        } catch (error) {
            this.handleError(error);
        }
    }

    static async listAnswers(data: AnswerListParams) {
        try {
            const response = await QnAApi.listAnswers(data);
            return {
                ...response.data,
                items: response.data.items.map(mapAnswerFromApi),
            };
        } catch (error) {
            this.handleError(error);
        }
    }


    private static handleError(error : unknown) {
        if(error instanceof AxiosError) {
            const msg = error.response?.data.message || 'Something went wrong';
            const status = error.response?.status;
            throw new BaseError(msg,status);
        }
        if(error instanceof Error) {
            throw new BaseError(error.message);
        }

        throw new BaseError('Unexpected error');
    }

}