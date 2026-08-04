import { AxiosError } from 'axios';

import * as QnAApi from '../api/endpoints/qnaAPI'

import { BaseError } from '../shared/errors/BaseError'
import { APP_MESSAGES } from '../shared/constants/messages';
import type {
    AnswerListParams,
    CreateQuestionRequest,
    CreateQuestionApiResponse,
    CreateSavedListRequest,
    EditAnswerRequest,
    EditAnswerApiResponse,
    EditQuestionRequest,
    EditQuestionApiResponse,
    GetAnswerAPIResponse,
    GetQuestionAPIResponse,
    PaginatedAnswerResponse,
    PostAnswerApiResponse,
    QuestionListAPIResponse,
    QuestionListPaginatedResponse,
    QuestionListParams,
    SavedListAPIResponse,
    SavedQuestionListIdsResponse,
    SaveQuestionApiResponse,
    SimpleSuccessResponse,
    CreateAcceptedAnswerRequest,
    AcceptAnswerAPIResponse,
    AiAssistResponse,
    AiChatMessageAPI,
    AiChatSessionAPI,
} from '../shared/types/api/qna';

export class QnAService {
    static async listQuestion(data?: QuestionListParams): Promise<QuestionListPaginatedResponse> {
        try {
            const response = await QnAApi.listQuestion(data);
            return response.data as QuestionListPaginatedResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async createQuestion(data: CreateQuestionRequest): Promise<CreateQuestionApiResponse> {
        try {
            const response = await QnAApi.createQuestion(data);
            return response.data as CreateQuestionApiResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getQuestion(questionId: string): Promise<GetQuestionAPIResponse> {
        try {
            const response = await QnAApi.getQuestion(questionId);
            return response.data as GetQuestionAPIResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async relatedQuestions(questionId: string): Promise<QuestionListAPIResponse[]> {
        try {
            const response = await QnAApi.relatedQuestions(questionId);
            return (Array.isArray(response.data) ? response.data : []) as QuestionListAPIResponse[];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async saveQuestion(questionId: string): Promise<SaveQuestionApiResponse> {
        try {
            const response = await QnAApi.saveQuestion(questionId);
            return response.data as SaveQuestionApiResponse
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async unsaveQuestion(questionId: string):Promise<boolean> {
        try {
            const response = await QnAApi.unsaveQuestion(questionId);
            return response.data as boolean
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async voteQuestion(questionId: string, value: 1 | -1): Promise<{ votes: number; userVote: 1 | -1 | 0 }> {
        try {
            const response = await QnAApi.voteQuestion(questionId, value);
            return response.data as { votes: number; userVote: 1 | -1 | 0 };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async voteAnswer(answerId: string, value: 1 | -1): Promise<{ voteCount: number; userVote: 1 | -1 | 0 }> {
        try {
            const response = await QnAApi.voteAnswer(answerId, value);
            return response.data as { voteCount: number; userVote: 1 | -1 | 0 };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async postAnswer(data: { questionId: string, answerText: string }): Promise<PostAnswerApiResponse> {
        try {
            const response = await QnAApi.postAnswer(data);
            return response.data as PostAnswerApiResponse
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async editAnswer(data: EditAnswerRequest): Promise<EditAnswerApiResponse> {
        try {
            const response = await QnAApi.editAnswer(data);
            return response.data as EditAnswerApiResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listAnswers(data: AnswerListParams): Promise<PaginatedAnswerResponse> {
        try {
            const response = await QnAApi.listAnswers(data);
            return response.data as PaginatedAnswerResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async editQuestion(data: EditQuestionRequest): Promise<EditQuestionApiResponse> {
        try {
            const response = await QnAApi.editQuestion(data);
            return response.data as EditQuestionApiResponse
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async getAnswer(answerId: string): Promise<GetAnswerAPIResponse> {
        try {
            const response = await QnAApi.getAnswer(answerId);
            return response.data as GetAnswerAPIResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listAnsweredQuestions(data: QuestionListParams): Promise<QuestionListPaginatedResponse> {
        try {
            const response = await QnAApi.listAnsweredQuestions(data);
            return response.data as QuestionListPaginatedResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listMyQuestions(userId: string, data: QuestionListParams): Promise<QuestionListPaginatedResponse> {
        try {
            const response = await QnAApi.listMyQuestions(userId, data);
            return response.data as QuestionListPaginatedResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listSavedLists(): Promise<SavedListAPIResponse[]> {
        try {
            const response = await QnAApi.listSavedLists();
            return response.data as SavedListAPIResponse[];
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async createSavedList(data: CreateSavedListRequest): Promise<{ id: string; name: string }> {
        try {
            const response = await QnAApi.createSavedList(data);
            return response.data as { id: string; name: string };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteSavedList(listId: string): Promise<SimpleSuccessResponse> {
        try {
            const response = await QnAApi.deleteSavedList(listId);
            return response.data as SimpleSuccessResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listSavedQuestions(params: QuestionListParams): Promise<QuestionListPaginatedResponse> {
        try {
            const response = await QnAApi.listSavedQuestions(params);
            return response.data as QuestionListPaginatedResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getSavedListIdsForQuestion(questionId: string): Promise<SavedQuestionListIdsResponse> {
        try {
            const response = await QnAApi.getSavedListIdsForQuestion(questionId);
            return response.data as SavedQuestionListIdsResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listSavedListQuestions(listId: string, params: QuestionListParams): Promise<QuestionListPaginatedResponse> {
        try {
            const response = await QnAApi.listSavedListQuestions(listId, params);
            return response.data as QuestionListPaginatedResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async addQuestionToSavedList(listId: string, questionId: string): Promise<SimpleSuccessResponse> {
        try {
            const response = await QnAApi.addQuestionToSavedList(listId, questionId);
            return response.data as SimpleSuccessResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async removeQuestionFromSavedList(listId: string, questionId: string): Promise<SimpleSuccessResponse> {
        try {
            const response = await QnAApi.removeQuestionFromSavedList(listId, questionId);
            return response.data as SimpleSuccessResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async acceptAnswer(data:CreateAcceptedAnswerRequest): Promise<AcceptAnswerAPIResponse> {
        try {
            const response = await QnAApi.acceptAnswer(data);
            return response.data as AcceptAnswerAPIResponse
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async removeAcceptedAnswer(questionId: string): Promise<void> {
        try {
            await QnAApi.removeAcceptedAnswer(questionId);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async aiAssist(prompt: string, sessionId?: string): Promise<AiAssistResponse> {
        try {
            const response = await QnAApi.aiAssist(prompt, sessionId);
            return response.data as AiAssistResponse;
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async createAiChatSession(): Promise<AiChatSessionAPI> {
        try {
            const response = await QnAApi.createAiChatSession();
            return response.data as AiChatSessionAPI;
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async listAiChatSessions(limit: number = 20): Promise<AiChatSessionAPI[]> {
        try {
            const response = await QnAApi.listAiChatSessions(limit);
            return response.data as AiChatSessionAPI[];
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async getAiChatMessages(sessionId: string, limit: number = 50): Promise<AiChatMessageAPI[]> {
        try {
            const response = await QnAApi.getAiChatMessages(sessionId, limit);
            return response.data as AiChatMessageAPI[];
        } catch (error) {
            throw this.handleError(error)
        }
    }

    static async deleteQuestion(questionId: string): Promise<void> {
        try {
            await QnAApi.deleteQuestion(questionId);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deleteAnswer(answerId: string): Promise<void> {
        try {
            await QnAApi.deleteAnswer(answerId);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private static handleError(error: unknown): never {
        if (error instanceof AxiosError) {
            const msg =
                error.response?.data.message || APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
            const status = error.response?.status;
            throw new BaseError(msg, status);
        }
        if (error instanceof Error) {
            throw new BaseError(error.message);
        }
        throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
    }
}
