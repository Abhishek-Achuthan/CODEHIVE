import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import type { IPostAnswerUseCase } from '../../../application/useCase/interface/qna/IPostAnswerUseCase';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { IListAnswerUseCase } from '../../../application/useCase/interface/qna/IListAnswerUseCase';
import { AnswerSort } from '../../../domain/types/AnswerSort';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { PostAnswerSchema } from '../../validation/qnaValidations';

@injectable()
export class AnswerController {
  constructor(
    @inject('IPostAnswerUseCase')
    private readonly _postAnswerUseCase: IPostAnswerUseCase,
    @inject('IListAnswerUseCase') 
    private readonly _listAnswerUseCase: IListAnswerUseCase,
  ) {}

  async handlePostAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input with Zod schema
      const validated = PostAnswerSchema.parse({
        questionId: req.body.questionId,
        answerText: req.body.answerText,
      });

      // Sanitize HTML content
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
    
      return res
        .status(HttpStatus.Created)
        .json({
          success: true,
          message: RESPONSE_MESSAGES.QA.ANSWER_POSTED,
          data,
        });
    } catch (error) {
      next(error);
    }
  }
  
  async handleListAnswers(req: Request,res: Response, next: NextFunction) {
    try {
        const {questionId,page,limit,sortBy} = req.query;

        const data = await this._listAnswerUseCase.execute({
            questionId:String(questionId),
            page:page?Number(page):1,
            limit:limit?Number(limit):10,
            sortBy:sortBy?sortBy as AnswerSort:AnswerSort.Newest,
        });

        console.log(data)

        return res.status(HttpStatus.OK).json(data);
    } catch (error) {
        next(error);
    }
  }
}
