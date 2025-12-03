import { Request,Response,NextFunction } from 'express';
import { inject,injectable } from 'tsyringe';
import type { ISaveQuestionUseCase } from '../../../application/useCase/interface/qna/ISaveQuestionUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';


@injectable()
export class SavedQuestionController {
    constructor(
        @inject('ISaveQuestionUseCase') private readonly _saveQuestionUseCase : ISaveQuestionUseCase
    ){}
    
    async handleSaveQuestion (req:Request,res:Response,next:NextFunction) {
        try {
            const {userId,questionId} = req.body;

            const savedQuestion = await this._saveQuestionUseCase.execute(userId,questionId);

            return res.status(HttpStatus.Created).json({
                success:true,
                data:savedQuestion
            })
        } catch (error) {
            next(error)
        }
    }
}