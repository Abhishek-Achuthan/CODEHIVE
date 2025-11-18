import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { ICreateQuestionUseCase } from '../../../application/useCase/interface/qna/ICreateQuestionUseCase';
import type { IListQuestionUseCase } from '../../../application/useCase/interface/qna/IListQuestionsUseCase';
import { QuestionListSchema } from '../../validation/qnaValidations';

@injectable()
export class QuestionController {
  constructor(
    @inject('ICreateQuestionUseCase')
    private readonly _createQuestionUseCase: ICreateQuestionUseCase,
    @inject('IListQuestionUseCase')
    private readonly _listQuestionUseCase: IListQuestionUseCase
  ) {}

  async handleCreateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      await this._createQuestionUseCase.execute(data);

      res.status(HttpStatus.Created).json({
        success: true,
        messsage: RESPONSE_MESSAGES.QA.QUESTION_POSTED,
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
}
