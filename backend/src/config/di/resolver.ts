import { container } from 'tsyringe';

import { ContainerSetup } from './container';
import { AuthController } from '../../presentation/controllers/auth/AuthController';
import { AdminController } from '../../presentation/controllers/admin/AdminController';
import { AuthMiddleware } from '../../presentation/middlewares/authMIddleware';
import { RoleMiddleware } from '../../presentation/middlewares/roleMiddleware';
import { QuestionController } from '../../presentation/controllers/qna/QuestionController';
import { AnswerController } from '../../presentation/controllers/qna/AnswerController';
import { SavedController } from '../../presentation/controllers/qna/SavedController';
import { UserController } from '../../presentation/controllers/user/UserController';
import { SessionController } from '../../presentation/controllers/session/SessionController';
import { MentorController } from '../../presentation/controllers/mentor/MentorController';
import { WebhookController } from '../../presentation/controllers/webhooks/WebhookController';

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);

export const adminController = container.resolve(AdminController);

export const authMiddleware = container.resolve(AuthMiddleware);

export const roleMiddleware = container.resolve(RoleMiddleware);

export const questionController = container.resolve(QuestionController);

export const answerController = container.resolve(AnswerController);

export const savedController = container.resolve(SavedController);

export const userController = container.resolve(UserController);

export const sessionController = container.resolve(SessionController);

export const mentorController = container.resolve(MentorController);

export const webhookController = container.resolve(WebhookController)




