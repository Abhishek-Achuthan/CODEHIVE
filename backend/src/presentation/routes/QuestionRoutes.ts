import { Router } from 'express';
import { questionController } from '../../config/di/resolver';


export class QuestionRoutes {
    private _router: Router;
    private _questionController


    constructor() {
        this._router = Router();
        this._questionController = questionController;
        this._setRoutes();
    }

    private _setRoutes() {
        this._router.post(
            '/questions',
            this._questionController.handleCreateQuestion.bind(this._questionController)
        )
        this._router.get(
            '/questions',
            this._questionController.handleListQuestions.bind(this._questionController)
        )
    }

    public getRoutes(): Router {
        return this._router;
    }

}