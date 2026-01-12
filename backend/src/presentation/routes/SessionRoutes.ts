import { Router } from 'express';
import { sessionController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';

export class SessionRoutes {
    private _router: Router;
    private _sessionController;
    private _authMiddleware;

    constructor() {
        this._router = Router();
        this._sessionController = sessionController;
        this._authMiddleware = authMiddleware;
        this._setRoutes();
    }

    private _setRoutes() {
        this._router.post(
            '/',
            this._authMiddleware.check,
            this._sessionController.handleBookSession.bind(this._sessionController)
        );

        this._router.get(
            '/',
            this._authMiddleware.check,
            this._sessionController.handleGetBookedSessions.bind(this._sessionController)
        );
    }

    public getRoutes(): Router {
        return this._router;
    }
}
