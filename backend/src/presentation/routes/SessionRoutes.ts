import { Router } from 'express';
import { sessionController, mentorController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';

export class SessionRoutes {
    private _router: Router;
    private _sessionController;
    private _authMiddleware;
    private _mentorController;

    constructor() {
        this._router = Router();
        this._sessionController = sessionController;
        this._authMiddleware = authMiddleware;
        this._mentorController = mentorController;
        this._setRoutes();
    }

    private _setRoutes() {
        this._router.post(
            '/stripe',
            this._authMiddleware.check,
            this._sessionController.handleBookSessionWithStripe.bind(this._sessionController)
        );

        this._router.post(
            '/wallet',
            this._authMiddleware.check,
            this._sessionController.handleBookSessionWithWallet.bind(this._sessionController)
        );

        this._router.get(
            '/',
            this._authMiddleware.check,
            this._sessionController.handleGetBookedSessions.bind(this._sessionController)
        );
        
        this._router.delete(
            '/:id',
            this._authMiddleware.check,
            this._sessionController.handleCancelSession.bind(this._sessionController)
        );

        this._router.get(
            '/profile/:id',
            this._authMiddleware.check,
            this._mentorController.handleViewMentorProfile.bind(this._mentorController)
        );

    }

    public getRoutes(): Router {
        return this._router;
    }
}
