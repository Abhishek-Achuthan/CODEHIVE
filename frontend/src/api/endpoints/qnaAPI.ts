import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AnswerListParams,
  CreateAnswerRequest,
  CreateSavedListRequest,
  CreateQuestionRequest,
  EditAnswerRequest,
  EditQuestionRequest,
  QuestionListParams,
  CreateAcceptedAnswerRequest,
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

export const voteQuestion = (questionId: string, value: 1 | -1) =>
  apiClient.post(API_ROUTES.QnA.VOTE_QUESTION(questionId), { value });

export const voteAnswer = (answerId: string, value: 1 | -1) =>
  apiClient.post(API_ROUTES.QnA.VOTE_ANSWER(answerId), { value });

export const postAnswer = (data: CreateAnswerRequest) =>
  apiClient.post(API_ROUTES.QnA.POST_ANSWER(data.questionId), data);

export const listAnswers = (data: AnswerListParams) => {
  const url = API_ROUTES.QnA.LIST_ANSWERS(data);
  return apiClient.get(url);
};

export const editQuestion = (data: EditQuestionRequest) =>
  apiClient.patch(API_ROUTES.QnA.EDIT_QUESTION(data.questionId), data);

export const editAnswer = (data: EditAnswerRequest) =>
  apiClient.patch(API_ROUTES.QnA.EDIT_ANSWER(data.answerId), data);

export const getAnswer = (answerId: string) =>
  apiClient.get(API_ROUTES.QnA.GET_ANSWER(answerId));

export const listAnsweredQuestions = (data?: QuestionListParams) => {
  const url = API_ROUTES.QnA.ANSWERED_QUESTIONS(data);
  return apiClient.get(url);
}

export const listMyQuestions = (userId: string, data?: QuestionListParams) => {
  const url = API_ROUTES.QnA.MY_QUESTIONS(userId, data);
  return apiClient.get(url);
}

export const listSavedLists = () =>
  apiClient.get(API_ROUTES.QnA.SAVED_LISTS);

export const createSavedList = (data: CreateSavedListRequest) =>
  apiClient.post(API_ROUTES.QnA.SAVED_LISTS, data);

export const deleteSavedList = (listId: string) =>
  apiClient.delete(API_ROUTES.QnA.DELETE_SAVED_LIST(listId));

export const listSavedQuestions = (params?: QuestionListParams) => {
  const url = API_ROUTES.QnA.SAVED_QUESTIONS(params);
  return apiClient.get(url);
};

export const getSavedListIdsForQuestion = (questionId: string) =>
  apiClient.get(API_ROUTES.QnA.SAVED_QUESTION_LIST_IDS(questionId));

export const listSavedListQuestions = (listId: string, params?: QuestionListParams) => {
  const url = API_ROUTES.QnA.SAVED_LIST_QUESTIONS(listId, params);
  return apiClient.get(url);
};

export const addQuestionToSavedList = (listId: string, questionId: string) =>
  apiClient.post(API_ROUTES.QnA.SAVED_LIST_ITEM(listId, questionId));

export const removeQuestionFromSavedList = (listId: string, questionId: string) =>
  apiClient.delete(API_ROUTES.QnA.SAVED_LIST_ITEM(listId, questionId));

export const acceptAnswer = (data: CreateAcceptedAnswerRequest) =>
  apiClient.post(API_ROUTES.QnA.ACCEPT_ANSWER(data.questionId), data);

export const removeAcceptedAnswer = (questionId: string) =>
  apiClient.delete(API_ROUTES.QnA.REMOVE_ACCEPTED_ANSWER(questionId));

export const aiAssist = (prompt: string, sessionId?: string) =>
  apiClient.post(API_ROUTES.QnA.AI_ASSIST, sessionId ? { prompt, sessionId } : { prompt });

export const createAiChatSession = () =>
  apiClient.post(API_ROUTES.QnA.AI_SESSIONS());

export const listAiChatSessions = (limit: number = 20) =>
  apiClient.get(API_ROUTES.QnA.AI_SESSIONS({ limit }));

export const getAiChatMessages = (sessionId: string, limit: number = 50) =>
  apiClient.get(API_ROUTES.QnA.AI_MESSAGES(sessionId, { limit }));

export const deleteQuestion = (questionId: string) =>
  apiClient.delete(API_ROUTES.QnA.GET_QUESTION(questionId));

export const deleteAnswer = (answerId: string) =>
  apiClient.delete(API_ROUTES.QnA.GET_ANSWER(answerId));

export const unsaveQuestion = (questionId:string) => 
  apiClient.delete(API_ROUTES.QnA.UNSAVE_QUESTION(questionId));

export const createComment = (answerId: string, content: string) =>
  apiClient.post(API_ROUTES.QnA.CREATE_COMMENT(answerId), { content });

export const getComments = (answerId: string) =>
  apiClient.get(API_ROUTES.QnA.GET_COMMENTS(answerId));

export const updateComment = (commentId: string, content: string) =>
  apiClient.patch(API_ROUTES.QnA.UPDATE_COMMENT(commentId), { content });

export const deleteComment = (commentId: string) =>
  apiClient.delete(API_ROUTES.QnA.DELETE_COMMENT(commentId));
