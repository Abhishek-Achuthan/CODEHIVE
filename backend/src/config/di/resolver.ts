import { container } from "tsyringe";

import { ContainerSetup } from "./container";
import { AuthController } from "../../presentation/controllers/auth/AuthController";
import { AdminController } from "../../presentation/controllers/auth/AdminController";

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);

export const adminController = container.resolve(AdminController);



