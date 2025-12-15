import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AnswerListParams,
  CreateAnswerRequest,
  CreateQuestionRequest,
  EditAnswerRequest,
  EditQuestionRequest,
  QuestionListParams,
} from "../../shared/types/api/qna";
import apiClient from "../apiClient";

export const listQuestion = (data?: QuestionListParams) => {
  const url = API_ROUTES.QnA.LIST_QUESTIONS(data);
  return apiClient.get(url);
};

export const createQuestion = (data: CreateQuestionRequest) =>
  apiClient.post(API_ROUTES.QnA.CREATE_QUESTION, data);

export const getQuestion = (questionId: string) =>
  apiClient.get(API_ROUTES.QnA.GET_QUESTION(questionId));

export const relatedQuestions = (questionId: string) =>
  apiClient.get(API_ROUTES.QnA.RELATED_QUESTIONS(questionId));

export const saveQuestion = (questionId: string) =>
  apiClient.post(API_ROUTES.QnA.SAVE_QUESTION(questionId));

export const postAnswer = (data: CreateAnswerRequest) =>
  apiClient.post(API_ROUTES.QnA.POST_ANSWER, data);

export const listAnswers = (data: AnswerListParams) => {
  const url = API_ROUTES.QnA.LIST_ANSWERS(data);
  return apiClient.get(url);
};

export const editQuestion = (data: EditQuestionRequest) =>
  apiClient.patch(API_ROUTES.QnA.EDIT_QUESTION(data.questionId), data);

export const editAnswer = (data:EditAnswerRequest) => 
  apiClient.patch(API_ROUTES.QnA.EDIT_ANSWER(data.answerId),data);



