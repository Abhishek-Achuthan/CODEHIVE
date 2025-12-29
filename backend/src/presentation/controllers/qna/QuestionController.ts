import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import sanitizeHtml from 'sanitize-html';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import {
  CreateQuestionSchema,
  QuestionListSchema,
  SaveQuestionSchema,
  ValidIdSchema,
  EditQuestionSchema,
  UserIdParamSchema,
  VoteQuestionSchema,
  AiAssistSchema,
  AiChatSessionIdParamSchema,
  AiChatSessionListQuerySchema,
  AiChatMessageListQuerySchema,
} from '../../validation/qnaValidations';
import type { ICreateQuestionUseCase } from '../../../application/useCase/interface/qna/ICreateQuestionUseCase';
import type { IListQuestionUseCase } from '../../../application/useCase/interface/qna/IListQuestionsUseCase';
import type { IGetQuestionUseCase } from '../../../application/useCase/interface/qna/IGetQuestionUseCase';
import type { IRelatedQuestionUseCase } from '../../../application/useCase/interface/qna/IRelatedQuestionUseCase';
import type { IToggleSaveQuestionUseCase } from '../../../application/useCase/interface/qna/IToggleSaveQuestionUseCase';
import type { IEditQuestionUseCase } from '../../../application/useCase/interface/qna/IEditQuestionUseCase';
import type { EditQuestionInputDTO } from '../../../application/dto/QuestionDTO';
import type { IListUserQuestionsUseCase } from '../../../application/useCase/interface/qna/IListUserQuestionsUseCase';
import type { IListAnsweredQuestionUseCase } from '../../../application/useCase/interface/qna/IListAnsweredQuestionsUseCase';
import type { IVoteQuestionUseCase } from '../../../application/useCase/interface/qna/IVoteQuestionUseCase';
import type { IAcceptAnswerUseCase } from '../../../application/useCase/interface/qna/IAcceptAnswerUseCase';
import type { IAiAssistantUseCase } from '../../../application/useCase/interface/qna/IAiAssistantUseCase';
import type { ICreateAiChatSessionUseCase } from '../../../application/useCase/interface/qna/ICreateAiChatSessionUseCase';
import type { IListAiChatSessionsUseCase } from '../../../application/useCase/interface/qna/IListAiChatSessionsUseCase';
import type { IGetAiChatMessagesUseCase } from '../../../application/useCase/interface/qna/IGetAiChatMessagesUseCase';


@injectable()
export class QuestionController {
  constructor(
    @inject('ICreateQuestionUseCase')
    private readonly _createQuestionUseCase: ICreateQuestionUseCase,
    @inject('IListQuestionUseCase')
    private readonly _listQuestionUseCase: IListQuestionUseCase,
    @inject('IGetQuestionUseCase')
    private readonly _getQuestionUseCase: IGetQuestionUseCase,
    @inject('IRelatedQuestionUseCase')
    private readonly _relatedQuestionUseCase: IRelatedQuestionUseCase,
    @inject('IToggleSaveQuestionUseCase')
    private readonly _toggleSaveQuestionUseCase: IToggleSaveQuestionUseCase,
    @inject('IEditQuestionUseCase')
    private readonly _editQuestionUseCase: IEditQuestionUseCase,
    @inject('IListUserQuestionsUseCase')
    private readonly _listUserQuestionsUseCase: IListUserQuestionsUseCase,
    @inject('IListAnsweredQuestionUseCase')
    private readonly _listAnsweredQuestionsUseCase: IListAnsweredQuestionUseCase,
    @inject('IVoteQuestionUseCase')
    private readonly _voteQuestionUseCase: IVoteQuestionUseCase,
    @inject('IAcceptAnswerUseCase')
    private readonly _acceptAnswerUseCase: IAcceptAnswerUseCase,
    @inject('IAiAssistantUseCase')
    private readonly _aiAssistantUseCase: IAiAssistantUseCase,
    @inject('ICreateAiChatSessionUseCase')
    private readonly _createAiChatSessionUseCase: ICreateAiChatSessionUseCase,
    @inject('IListAiChatSessionsUseCase')
    private readonly _listAiChatSessionsUseCase: IListAiChatSessionsUseCase,
    @inject('IGetAiChatMessagesUseCase')
    private readonly _getAiChatMessagesUseCase: IGetAiChatMessagesUseCase
  ) { }

  async handleCreateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateQuestionSchema.parse(req.body);

      const cleanHtml = sanitizeHtml(validated.descriptionHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img',
          'pre',
          'code',
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt'],
          a: ['href', 'target', 'rel'],
        },
      });

      const payload = {
        ...validated,
        descriptionHtml: cleanHtml,
        tags: validated.tags || [],
      };

      const created = await this._createQuestionUseCase.execute(payload);

      res.status(HttpStatus.Created).json({
        success: true,
        messsage: RESPONSE_MESSAGES.QA.QUESTION_POSTED,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleVoteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.id });
      const { value } = VoteQuestionSchema.parse(req.body);

      const userId = req.user.id;

      const result = await this._voteQuestionUseCase.execute(
        questionId,
        userId,
        value
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleListQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = QuestionListSchema.parse(req.query);

      const data = await this._listQuestionUseCase.execute(parsedData);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleGetQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.id });
      const userId = req.user.id;

      const data = await this._getQuestionUseCase.execute(questionId, userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleRelatedQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.id });

      const data = await this._relatedQuestionUseCase.execute(questionId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleSaveQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId, userid } = SaveQuestionSchema.parse({
        questionId: req.params.id,
        userid: req.user.id,
      });

      const { isBookmarked } = await this._toggleSaveQuestionUseCase.execute(
        questionId,
        userid
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: isBookmarked,
        message: isBookmarked
          ? RESPONSE_MESSAGES.QA.SAVE_QUESTION
          : RESPONSE_MESSAGES.QA.UNSAVE_QUESTION,
      });
    } catch (error) {
      next(error);
    }
  }

  async hanldeEditQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.id });
      const validated = EditQuestionSchema.parse(req.body);
      const userId = req.user.id;

      const cleanHtml = validated.descriptionHtml
        ? sanitizeHtml(validated.descriptionHtml, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img',
            'pre',
            'code',
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt'],
            a: ['href', 'target', 'rel'],
          },
        })
        : undefined;

      const payload: EditQuestionInputDTO = {
        version: validated.version,
        ...(validated.title !== undefined && { title: validated.title }),
        ...(cleanHtml !== undefined && { descriptionHtml: cleanHtml }),
        ...(validated.tags !== undefined && { tags: validated.tags }),
      };

      const updated = await this._editQuestionUseCase.execute(
        payload,
        questionId,
        userId
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.QA.QUESTION_UPDATED,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleListUserQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = UserIdParamSchema.parse({ userId: req.params.userId });

      const parsedData = QuestionListSchema.parse({
        ...req.query,
        'filter.askedBy': userId,
      });

      const data = await this._listUserQuestionsUseCase.execute(
        userId!,
        parsedData
      );

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleListAnsweredQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.id;

      const queryParams = QuestionListSchema.parse(req.query);

      const result = await this._listAnsweredQuestionsUseCase.execute(
        userId,
        queryParams
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleAcceptAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.id });
      const { answerId } = req.body;

      const inputData = { userId, questionId, answerId };

      const acceptedAnswer = await this._acceptAnswerUseCase.execute(
        inputData
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.QA.ANSWER_ACCEPTED,
        data: acceptedAnswer,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleAiAssist(req:Request,res:Response,next:NextFunction) {
    try {

      const userId = req.user.id;
      const { prompt, sessionId } = AiAssistSchema.parse(req.body);

      const input = sessionId ? { userId, prompt, sessionId } : { userId, prompt };

      const result = await this._aiAssistantUseCase.execute(input);

      res.status(HttpStatus.OK).json(result);

    } catch (error) {
      next(error);
    }
  }

  async handleCreateAiChatSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const created = await this._createAiChatSessionUseCase.execute(userId);

      return res.status(HttpStatus.Created).json(created);
    } catch (error) {
      next(error);
    }
  }

  async handleListAiChatSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { limit } = AiChatSessionListQuerySchema.parse(req.query);

      const sessions = await this._listAiChatSessionsUseCase.execute(userId, limit);

      return res.status(HttpStatus.OK).json(sessions);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAiChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { sessionId } = AiChatSessionIdParamSchema.parse({ sessionId: req.params.sessionId });
      const { limit } = AiChatMessageListQuerySchema.parse(req.query);

      const messages = await this._getAiChatMessagesUseCase.execute(userId, sessionId, limit);

      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
