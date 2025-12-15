import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import type { IPostAnswerUseCase } from '../../../application/useCase/interface/qna/IPostAnswerUseCase';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { IListAnswerUseCase } from '../../../application/useCase/interface/qna/IListAnswerUseCase';
import { AnswerSort } from '../../../domain/types/AnswerSort';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { PostAnswerSchema, EditAnswerSchema } from '../../validation/qnaValidations';
import type { IEditAnswerUseCase } from '../../../application/useCase/interface/qna/IEditAnswerUseCase';
import { IEditAnswerInputDTO } from '../../../application/dto/AnswerDTO';

@injectable()
export class AnswerController {
  constructor(
    @inject('IPostAnswerUseCase')
    private readonly _postAnswerUseCase: IPostAnswerUseCase,
    @inject('IListAnswerUseCase') 
    private readonly _listAnswerUseCase: IListAnswerUseCase,
    @inject('IEditAnswerUseCase')
    private readonly _editAnswerUseCase: IEditAnswerUseCase,
  ) {}

  async handlePostAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = PostAnswerSchema.parse({
        questionId: req.body.questionId,
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

  async handleEditAnswer(req:Request,res:Response,next:NextFunction) {
    try {
      const answerId = req.params.id;
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

      const data : IEditAnswerInputDTO = {
        answerText: cleanHtml,
        version: validated.version,
        userId,
        ...(answerId && { answerId })
      }
      
      const updatedAns = await this._editAnswerUseCase.execute(data);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.QA.ANSWER_UPDATED,
        data: updatedAns
      })
    } catch (error) {
      next(error)
    }
  }
}
