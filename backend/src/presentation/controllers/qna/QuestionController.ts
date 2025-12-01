import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { ICreateQuestionUseCase } from '../../../application/useCase/interface/qna/ICreateQuestionUseCase';
import type { IListQuestionUseCase } from '../../../application/useCase/interface/qna/IListQuestionsUseCase';
import { CreateQuestionSchema, QuestionListSchema, ValidIdSchema } from '../../validation/qnaValidations';
import sanitizeHtml from 'sanitize-html'
import type { IGetQuestionUseCase } from '../../../application/useCase/interface/qna/IGetQuestionUseCase';

@injectable()
export class QuestionController {
  constructor(
    @inject('ICreateQuestionUseCase')
    private readonly _createQuestionUseCase: ICreateQuestionUseCase,
    @inject('IListQuestionUseCase')
    private readonly _listQuestionUseCase: IListQuestionUseCase,
    @inject('IGetQuestionUseCase') 
    private readonly _getQuestionUseCase: IGetQuestionUseCase
  ) {}

  async handleCreateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('create-question body:', req.body);
      const validated = CreateQuestionSchema.parse(req.body);

      const cleanHtml = sanitizeHtml(validated.descriptionHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','pre','code']),
        allowedAttributes:{
          ...sanitizeHtml.defaults.allowedAttributes,
          img:['src','alt'],
          a:['href','target','rel'],
        }
      });

      const payload = {...validated,descriptionHtml:cleanHtml,tags:validated.tags || []};

      const created = await this._createQuestionUseCase.execute(payload);

      res.status(HttpStatus.Created).json({
        success: true,
        messsage: RESPONSE_MESSAGES.QA.QUESTION_POSTED,
        data:created
      });
    } catch (error) {
      next(error);
    }
  }

  async handleListQuestions(req: Request, res: Response, next: NextFunction) {
    try {                                             
      const data = QuestionListSchema.parse(req.query);

      const questions = await this._listQuestionUseCase.execute(data);

      res.status(HttpStatus.OK).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }

  async hanldeGetQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = ValidIdSchema.parse(req.params.questionId);

      const question = await this._getQuestionUseCase.execute(id.questionId)

      res.status(HttpStatus.OK).json({
        success:true,
        data:question
      })
    } catch (error) {
      next(error)
    }
  }
}
