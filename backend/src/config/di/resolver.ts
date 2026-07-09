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
import { WalletController } from '../../presentation/controllers/wallet/WalletController';
import { StripeRefundRetryService } from '../../application/services/StripeRefundRetryService';
import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import { RoomSocketHandler } from '../../presentation/socket/RoomSocketHandler';
import { ChatSocketHandler } from '../../presentation/socket/ChatSocketHandler';
import { PresenceSocketHandler } from '../../presentation/socket/PresenceSocketHandler';
import { PollSocketHandler } from '../../presentation/socket/PollSocketHandler';
import { HocuspocusService } from '../../infrastructure/realtime/HocuspocusService';
import { ISocketService } from '../../application/ports/socket/ISocketService';
import { RoomController } from '../../presentation/controllers/room/RoomController';
import { InviteController } from '../../presentation/controllers/room/InviteController';
import { PublicNoteController } from '../../presentation/controllers/note/PublicNoteController';
import { MessageController } from '../../presentation/controllers/message/MessageController';
import { PollController } from '../../presentation/controllers/poll/PollController';
import { IMessageQueueService } from '../../application/ports/queue/IMessageQueueService';
import { PlanController } from '../../presentation/controllers/plan/PlanController';
import { ILoggerService } from '../../application/ports/logging/ILoggerService';
import { SubscriptionController } from '../../presentation/controllers/Subscription/SubscriptionController';

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

export const walletController = container.resolve(WalletController);

export const hocuspocusService = container.resolve(HocuspocusService);

export const roomController = container.resolve(RoomController);

export const inviteController = container.resolve(InviteController);

export const publicNoteController = container.resolve(PublicNoteController);

export const messageController = container.resolve(MessageController);

export const pollController = container.resolve(PollController);

export const planController = container.resolve(PlanController);

export const subscriptionController = container.resolve(SubscriptionController);

import { NotificationController } from '../../presentation/controllers/notifications/NotificationController';
export const notificationController = container.resolve(NotificationController);

export const socketHandlers: ISocketHandler[] = [
  container.resolve(RoomSocketHandler),
  container.resolve(ChatSocketHandler),
  container.resolve(PresenceSocketHandler),
  container.resolve(PollSocketHandler),
];
export const socketService = container.resolve<ISocketService>('ISocketService');

export const loggerService = container.resolve<ILoggerService>('ILoggerService');

export const messageQueueService = container.resolve<IMessageQueueService>('IMessageQueueService');

export const stripeRefundRetryService = container.resolve(StripeRefundRetryService);

