import { Request,Response,NextFunction } from 'express';
import { inject,injectable } from 'tsyringe';
import type { IToggleSaveQuestionUseCase } from '../../../application/useCase/interface/qna/IToggleSaveQuestionUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';


@injectable()
export class SavedQuestionController {
    constructor(
        @inject('IToggleSaveQuestionUseCase') private readonly _toggleSaveQuestionUseCase : IToggleSaveQuestionUseCase
    ){}
    
    async handleSaveQuestion (req:Request,res:Response,next:NextFunction) {
        try {
            const {userId,questionId} = req.body;

            const savedQuestion = await this._toggleSaveQuestionUseCase.execute(userId,questionId);

            return res.status(HttpStatus.Created).json({
                success:true,
                data:savedQuestion
            })
        } catch (error) {
            next(error)
        }
    }
}