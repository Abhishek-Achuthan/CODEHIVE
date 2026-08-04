import { Router } from 'express';
import { questionController } from '../../config/di/resolver';
import { answerController } from '../../config/di/resolver';
import { commentController } from '../../config/di/resolver';
import { savedController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';


export class QnARoutes {
    private _router: Router;
    private _questionController
    private _answerController
    private _commentController
    private _savedController 
    private _authMiddleware


    constructor() {
        this._router = Router();
        this._questionController = questionController;
        this._answerController = answerController;
        this._commentController = commentController;
        this._savedController = savedController;
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

        this._router.post(
            '/questions/ai-assist',
            this._authMiddleware.check,
            this._questionController.handleAiAssist.bind(this._questionController)
        );

        this._router.post(
            '/questions/ai-sessions',
            this._authMiddleware.check,
            this._questionController.handleCreateAiChatSession.bind(this._questionController)
        );

        this._router.get(
            '/questions/ai-sessions',
            this._authMiddleware.check,
            this._questionController.handleListAiChatSessions.bind(this._questionController)
        );

        this._router.get(
            '/questions/ai-sessions/:sessionId/messages',
            this._authMiddleware.check,
            this._questionController.handleGetAiChatMessages.bind(this._questionController)
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
        this._router.delete(
            '/questions/:id/save',
            authMiddleware.check,
            this._questionController.handleUnsaveQuestion.bind(this._questionController)
        );
        this._router.post(
            '/questions/:id/vote',
            this._authMiddleware.check,
            this._questionController.handleVoteQuestion.bind(this._questionController)
        );

        this._router.post(
            '/questions/:id/accept-answer',
            this._authMiddleware.check,
            this._questionController.handleAcceptAnswer.bind(this._questionController)
        );

        this._router.delete(
            '/questions/:id/accept-answer',
            this._authMiddleware.check,
            this._questionController.handleRemoveAcceptedAnswer.bind(this._questionController)
        );

        this._router.delete(
            '/questions/:id',
            this._authMiddleware.check,
            this._questionController.handleDeleteQuestion.bind(this._questionController)
        );

        //--------------------------Saved Routes-----------------------------------//

        this._router.get(
            '/saved/lists',
            this._authMiddleware.check,
            this._savedController.handleListLists.bind(this._savedController)
        );

        this._router.post(
            '/saved/lists',
            this._authMiddleware.check,
            this._savedController.handleCreateList.bind(this._savedController)
        );

        this._router.delete(
            '/saved/lists/:listId',
            this._authMiddleware.check,
            this._savedController.handleDeleteList.bind(this._savedController)
        );

        this._router.get(
            '/saved/questions',
            this._authMiddleware.check,
            this._savedController.handleListAllSaved.bind(this._savedController)
        );

        this._router.get(
            '/saved/questions/:questionId/lists',
            this._authMiddleware.check,
            this._savedController.handleGetListIdsForQuestion.bind(this._savedController)
        );

        this._router.get(
            '/saved/lists/:listId/questions',
            this._authMiddleware.check,
            this._savedController.handleListSavedListQuestions.bind(this._savedController)
        );

        this._router.post(
            '/saved/lists/:listId/questions/:questionId',
            this._authMiddleware.check,
            this._savedController.handleAddToList.bind(this._savedController)
        );

        this._router.delete(
            '/saved/lists/:listId/questions/:questionId',
            this._authMiddleware.check,
            this._savedController.handleRemoveFromList.bind(this._savedController)
        );
        //--------------------------Answer Routes---------------------------------------//

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
        );

        this._router.post(
            '/answers/:answerId/vote',
            this._authMiddleware.check,
            this._answerController.handleVoteAnswer.bind(this._answerController)
        );

        this._router.delete(
            '/answers/:answerId',
            this._authMiddleware.check,
            this._answerController.handleDeleteAnswer.bind(this._answerController)
        );

        //--------------------------Comment Routes--------------------------------------//

        this._router.post(
            '/answers/:answerId/comments',
            this._authMiddleware.check,
            this._commentController.handleCreateComment.bind(this._commentController)
        );

        this._router.get(
            '/answers/:answerId/comments',
            this._authMiddleware.check,
            this._commentController.handleGetComments.bind(this._commentController)
        );

        this._router.patch(
            '/comments/:commentId',
            this._authMiddleware.check,
            this._commentController.handleUpdateComment.bind(this._commentController)
        );

        this._router.delete(
            '/comments/:commentId',
            this._authMiddleware.check,
            this._commentController.handleDeleteComment.bind(this._commentController)
        );
       
    }

    public getRoutes(): Router {
        return this._router;
    };

}