import { Router } from 'express';
import { webhookController } from '../../config/di/resolver';

export class WebhooksRoutes {

    private _router : Router
    private _webhookController 

    constructor(){
        this._router = Router();
        this._webhookController = webhookController;
        this._setRoutes()
    }

    private _setRoutes(){
        this._router.post('/stripe',
            this._webhookController.handlePayment.bind(this._webhookController)
        );
    }

    public getRoutes() {
        return this._router;
    }
}