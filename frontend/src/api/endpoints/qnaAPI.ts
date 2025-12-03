import { API_ROUTES } from "../../constants/apiRoutes";
import type { CreateQuestion, questionList } from "../../shared/types/qnaTypes";
import apiClient from "../apiClient";

export const listQuestion = (data?: questionList) => {
  const url = API_ROUTES.QnA.LIST_QUESTIONS(data);
  return apiClient.get(url);
};

export const createQuestion = (data:CreateQuestion) => apiClient.post(API_ROUTES.QnA.CREATE_QUESTION,data);

export const getQuestion = (questionId:string) => apiClient.get(API_ROUTES.QnA.GET_QUESTION(questionId));

export const relatedQuestions = (questionId:string) => apiClient.get(API_ROUTES.QnA.RELATED_QUESTIONS(questionId));
 