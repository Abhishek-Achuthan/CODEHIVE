import { AxiosError } from 'axios';

import * as QnAApi from '../api/endpoints/qnaAPI'

import { BaseError } from '../shared/errors/BaseError'
import type { CreateQuestion, questionList } from '../shared/types/qnaTypes'


export class QnAService {
    static async listQuestions(data:questionList) {
        try {
            const response = await QnAApi.listQuestion(data);
            return response.data;
        } catch (error) {
            this.handleError(error)
        }
    }

    static async createQuestion(data:CreateQuestion) {
        try {
            const response = await QnAApi.createQuestion(data);
            return response.data;
        }catch(error) {
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