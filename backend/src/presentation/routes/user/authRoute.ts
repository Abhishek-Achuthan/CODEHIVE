import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { AuthController } from "../../controllers/auth/authController";

const authController = container.resolve(AuthController);


export class Auth_routes {
  private _router: Router;
  constructor() {
    this._router = Router();
    this.setRoute();
  }

  private setRoute() {
    this._router.post('/login',(req:Request,res:Response)=>{
        authController.login(req,res);
    });

    this._router.post('/sign-up',(req:Request,res:Response)=>{
      authController.registerUser(req,res);
    });
  }

  public getRoute(){
    return this._router;
  }
}
