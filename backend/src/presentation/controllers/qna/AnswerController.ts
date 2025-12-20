import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import type { IPostAnswerUseCase } from '../../../application/useCase/interface/qna/IPostAnswerUseCase';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { IListAnswerUseCase } from '../../../application/useCase/interface/qna/IListAnswerUseCase';
import { AnswerSort } from '../../../domain/types/AnswerSort';
import { HttpStatus } from '../../../shared/httpStatusCode';
import {
  PostAnswerSchema,
  EditAnswerSchema,
  ValidAnswerIdSchema,
  VoteAnswerSchema,
} from '../../validation/qnaValidations';
import type { IEditAnswerUseCase } from '../../../application/useCase/interface/qna/IEditAnswerUseCase';
import { IEditAnswerInputDTO } from '../../../application/dto/AnswerDTO';
import type { IGetAnswerUseCase } from '../../../application/useCase/interface/qna/IGetAnswerUseCase';
import type { IVoteAnswerUseCase } from '../../../application/useCase/interface/qna/IVoteAnswerUseCase';

@injectable()
export class AnswerController {
  constructor(
    @inject('IPostAnswerUseCase')
    private readonly _postAnswerUseCase: IPostAnswerUseCase,
    @inject('IListAnswerUseCase')
    private readonly _listAnswerUseCase: IListAnswerUseCase,
    @inject('IEditAnswerUseCase')
    private readonly _editAnswerUseCase: IEditAnswerUseCase,
    @inject('IGetAnswerUseCase')
    private readonly _getAnswerUseCase: IGetAnswerUseCase,
    @inject('IVoteAnswerUseCase')
    private readonly _voteAnswerUseCase: IVoteAnswerUseCase
  ) {}

  async handlePostAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const validated = PostAnswerSchema.parse({
        questionId,
        answerText: req.body.answerText,
      });

      const cleanHtml = sanitizeHtml(validated.answerText, {
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

      const answeredBy = req.user?.id ?? '';

      const data = await this._postAnswerUseCase.execute({
        answeredBy,
        questionId: validated.questionId,
        answerText: cleanHtml,
      });

      return res.status(HttpStatus.Created).json({
        success: true,
        message: RESPONSE_MESSAGES.QA.ANSWER_POSTED,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleListAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const { page, limit, sortBy, search } = req.query;

      const data = await this._listAnswerUseCase.execute({
        questionId: String(questionId),
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy: sortBy ? (sortBy as AnswerSort) : AnswerSort.Newest,
        ...(search ? { search: String(search) } : {}),
      });

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleEditAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = req.params;
      const userId = req.user.id;

      const validated = EditAnswerSchema.parse({
        answerText: req.body.answerText,
        version: req.body.version,
      });

      const cleanHtml = sanitizeHtml(validated.answerText, {
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

      const data: IEditAnswerInputDTO = {
        answerText: cleanHtml,
        version: validated.version,
        userId,
        ...(answerId && { answerId }),
      };

      const updatedAns = await this._editAnswerUseCase.execute(data);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.QA.ANSWER_UPDATED,
        data: updatedAns,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = req.params

      const data = await this._getAnswerUseCase.execute(answerId!);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleVoteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = ValidAnswerIdSchema.parse({ answerId: req.params.answerId });
      const { value } = VoteAnswerSchema.parse(req.body);

      const userId = req.user.id;

      const result = await this._voteAnswerUseCase.execute(answerId, userId, value);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
