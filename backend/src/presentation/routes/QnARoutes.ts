import { Router } from 'express';
import { questionController } from '../../config/di/resolver';
import { answerController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';


export class QnARoutes {
    private _router: Router;
    private _questionController
    private _answerController
    private _authMiddleware


    constructor() {
        this._router = Router();
        this._questionController = questionController;
        this._answerController = answerController;
        this._authMiddleware = authMiddleware;
        this._setRoutes();
    }

    private _setRoutes() {
        //--------------------------Question Routes-----------------------------------//

        this._router.post(
            '/questions',this._authMiddleware.check,
            this._questionController.handleCreateQuestion.bind(this._questionController)
        );
        this._router.get(
            '/questions',
            this._authMiddleware.check,
            this._questionController.handleListQuestions.bind(this._questionController)
        );
        this._router.get(
            '/questions/:id',
            this._authMiddleware.check,
            this._questionController.handleGetQuestion.bind(this._questionController)
        );
        this._router.get(
            '/questions/:id/related',
            this._questionController.handleRelatedQuestion.bind(this._questionController)
        );
        this._router.patch(
            '/questions/:id',
            authMiddleware.check,
            this._questionController.hanldeEditQuestion.bind(this._questionController)
        );
        this._router.post(
            '/questions/:id/save',
            this._authMiddleware.check,
            this._questionController.handleSaveQuestion.bind(this._questionController)
        );


        //--------------------------Answer Routes (Nested under Questions)--------------------------//

        this._router.get(
            '/questions/:questionId/answers',
            this._authMiddleware.check,
            this._answerController.handleListAnswers.bind(this._answerController)
        );

        this._router.post(
            '/questions/:questionId/answers',
            this._authMiddleware.check,
            this._answerController.handlePostAnswer.bind(this._answerController)
        );

        this._router.get(
            '/answers/:answerId',
            this._authMiddleware.check,
            this._answerController.handleGetAnswer.bind(this._answerController)
        );

        this._router.patch(
            '/answers/:answerId',
            this._authMiddleware.check,
            this._answerController.handleEditAnswer.bind(this._answerController)
        )

    }

    public getRoutes(): Router {
        return this._router;
    };

}