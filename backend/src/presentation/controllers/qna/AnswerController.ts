import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import type { IPostAnswerUseCase } from '../../../application/useCase/interface/qna/IPostAnswerUseCase';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import type { IListAnswerUseCase } from '../../../application/useCase/interface/qna/IListAnswerUseCase';
import { AnswerSort } from '../../../domain/types/AnswerSort';
import { HttpStatus } from '../../../shared/httpStatusCode';

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
        const { questionId, answerText } = req.body;

        const answeredBy = req.user?.id?? '';
    
        const data = await this._postAnswerUseCase.execute({
          answeredBy,
          questionId,
          answerText,
        });
    
        return res
          .status(HttpStatus.Created)
          .json({
            success: true,
            message: RESPONSE_MESSAGES.QA.ANSWER_POSTED,
            data,
          });
    } catch (error) {
        next(error)
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
