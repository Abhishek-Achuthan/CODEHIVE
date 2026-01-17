import { Router } from 'express';
import { authMiddleware } from '../../config/di/resolver';
import { mentorController } from '../../config/di/resolver';
import { roleMiddleware } from '../../config/di/resolver';
import { UserRole } from '../../domain/types/UserRole';

export class MentorRoutes {
    private _router: Router;
    private _authMiddleware;
    private _mentorController;
    private _roleMiddleware;

    constructor() {
        this._router = Router();
        this._authMiddleware = authMiddleware;
        this._mentorController = mentorController;
        this._roleMiddleware = roleMiddleware;
        this._setRoutes();
    }

    private _setRoutes() {
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

        // Get mentor's own availability rules
        this._router.get(
            '/me/availability',
            this._authMiddleware.check,
            this._roleMiddleware.authorize([UserRole.MENTOR]),
            this._mentorController.handleGetMyAvailability.bind(this._mentorController)
        );

        // Delete/deactivate an availability rule
        this._router.delete(
            '/availability/:id',
            this._authMiddleware.check,
            this._roleMiddleware.authorize([UserRole.MENTOR]),
            this._mentorController.handleDeleteAvailability.bind(this._mentorController)
        );

        // Add exception date to an availability rule
        this._router.patch(
            '/availability/:id/exceptions',
            this._authMiddleware.check,
            this._roleMiddleware.authorize([UserRole.MENTOR]),
            this._mentorController.handleAddException.bind(this._mentorController)
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