import { Router } from 'express';
import { sessionController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';
import { roleMiddleware } from '../../config/di/resolver';
import { UserRole } from '../../domain/types/UserRole';

export class SessionRoutes {
    private _router: Router;
    private _sessionController;
    private _authMiddleware;
    private _roleMiddleware;

    constructor() {
        this._router = Router();
        this._sessionController = sessionController;
        this._authMiddleware = authMiddleware;
        this._roleMiddleware = roleMiddleware
        this._setRoutes();
    }

    private _setRoutes() {
        this._router.post(
            '/session/mentors/availability',
            this._authMiddleware.check,
            this._sessionController.handleSetAvailability.bind(this._sessionController)
        );

        this._router.get(
            '/session/mentors/:mentorId/available',
            this._roleMiddleware.authorize([UserRole.USER]),
            this._sessionController.handleGetAvailability.bind(this._sessionController)
        );

        // List Mentors
        this._router.get(
            '/session/mentors',
            this._authMiddleware.check,
            this._sessionController.handleListMentors.bind(this._sessionController)
        );

        // Sessions
        this._router.post(
            '/sessions',
            this._authMiddleware.check,
            this._sessionController.handleBookSession.bind(this._sessionController)
        );

        this._router.get(
            '/sessions',
            this._authMiddleware.check,
            this._sessionController.handleGetBookedSessions.bind(this._sessionController)
        );

        this._router.get(
            '/sessions'
        )
    }

    public getRoutes(): Router {
        return this._router;
    }
}
