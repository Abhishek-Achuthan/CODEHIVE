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
} from '../../validation/qnaValidations';
import type { ICreateQuestionUseCase } from '../../../application/useCase/interface/qna/ICreateQuestionUseCase';
import type { IListQuestionUseCase } from '../../../application/useCase/interface/qna/IListQuestionsUseCase';
import type { IGetQuestionUseCase } from '../../../application/useCase/interface/qna/IGetQuestionUseCase';
import type { IRelatedQuestionUseCase } from '../../../application/useCase/interface/qna/IRelatedQuestionUseCase';
import type { IToggleSaveQuestionUseCase } from '../../../application/useCase/interface/qna/IToggleSaveQuestionUseCase';

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
  ) {}

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
      const userId = req.user?.id

      const data = await this._getQuestionUseCase.execute(questionId,userId!);

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
        userid: req.user?.id,
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
}
