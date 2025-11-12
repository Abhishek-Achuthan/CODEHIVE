import { container } from 'tsyringe';

import { ContainerSetup } from './container';
import { AuthController } from '../../presentation/controllers/auth/AuthController';
import { AdminController } from '../../presentation/controllers/auth/AdminController';
import { AuthMiddleware } from '../../presentation/middlewares/authMIddleware';
import { RoleMiddleware } from '../../presentation/middlewares/roleMiddleware';

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);

export const adminController = container.resolve(AdminController);

export const authMiddleware = container.resolve(AuthMiddleware);

export const roleMiddleware = container.resolve(RoleMiddleware);



