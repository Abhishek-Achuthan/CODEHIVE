import { Router } from 'express';
import { container } from 'tsyringe';
import { CodeController } from '../controllers/code/CodeController';
import { authMiddleware } from '../../config/di/resolver';

export class CodeRoutes {
  private router = Router();
  private ctrl: CodeController;

  constructor() {
    this.ctrl = container.resolve(CodeController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/execute',
      authMiddleware.check,
      this.ctrl.execute,
    );
  }

  public getRoutes() {
    return this.router;
  }
}


