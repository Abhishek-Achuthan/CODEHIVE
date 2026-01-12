import { Router } from 'express';
import { authMiddleware } from '../../config/di/resolver';
import { mentorController } from '../../config/di/resolver';
import { roleMiddleware } from '../../config/di/resolver';
import { UserRole } from '../../domain/types/UserRole';

export class MentorRoutes  {
    private _router : Router;
    private _authMiddleware;
    private _mentorController;
    private _roleMiddleware;

    constructor(){
        this._router = Router();
        this._authMiddleware = authMiddleware;
        this._mentorController = mentorController;
        this._roleMiddleware = roleMiddleware;
        this._setRoutes();
    }

    private _setRoutes(){
        this._router.get(
            '/',
            this._authMiddleware.check,
            this._mentorController.handleListMentors.bind(this._mentorController)
        );

        this._router.post(
            '/availability',
            this._authMiddleware.check,
            this._roleMiddleware.authorize([UserRole.MENTOR]),
            this._mentorController.handleSetAvailability.bind(this._mentorController)
        );

        this._router.get(
            '/:mentorId/available',
            this._authMiddleware.check,
            this._mentorController.handleGetAvailableSlots.bind(this._mentorController)
        );
    }

    public getRoutes() {
       return this._router
    }

}