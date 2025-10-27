import { container } from "tsyringe";

import { ContainerSetup } from "./container";
import { AuthController } from "../../presentation/controllers/auth/AuthController";

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);


