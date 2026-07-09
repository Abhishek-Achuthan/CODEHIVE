import { container } from 'tsyringe';
import { env } from '../envConfig';
import { ICacheService } from '../../application/ports/cache/ICacheService';
import { CacheService } from '../../infrastructure/adapters/cache/CacheService';
import { IEmailService } from '../../application/ports/mail/IEmailService';
import { MailService } from '../../infrastructure/adapters/mail/MailService';
import { TemplateFactoryImpl } from '../../infrastructure/adapters/mail/template/TemplateFactory';
import { IEmailTemplateFactory } from '../../application/ports/mail/template/IEmailTemplateFactory';
import { IJWTService } from '../../application/ports/security/IJWTService';
import { JWTService } from '../../infrastructure/adapters/security/JWTService';
import { IHashService } from '../../application/ports/security/IHashService';
import { HashService } from '../../infrastructure/adapters/security/HashService';
import { IOTPService } from '../../application/ports/otp/IOTPService';
import { OTPService } from '../../infrastructure/adapters/otp/OTPService';
import { ITokenBlacklistService } from '../../application/ports/security/ITokenBlacklistService';
import { TokenBlacklistService } from '../../infrastructure/adapters/security/TokenBlacklistService';
import { IGoogleAuthService } from '../../application/ports/security/IGoogleAuthService';
import { GoogleAuthService } from '../../infrastructure/adapters/security/GoogleAuthService';
import { IGithubAuthService } from '../../application/ports/security/IGithubAuthService';
import { GitHubAuthService } from '../../infrastructure/adapters/security/GithubAuthService';
import { IAIService } from '../../application/ports/ai/IAIService';
import { AIService } from '../../infrastructure/adapters/ai/AIService';
import { IRRuleSlotService } from '../../application/ports/slot/IRRuleSlotService';
import { RRuleSlotService } from '../../infrastructure/adapters/session/RRuleSlotService';
import { ISlotConflictService } from '../../application/ports/slot/ISlotConflictService';
import { SlotConflictService } from '../../infrastructure/adapters/session/SlotConflictService';
import { IWalletService } from '../../application/ports/wallet/IWalletService';
import { WalletService } from '../../infrastructure/adapters/wallet/WalletService';
import { IPaymentService } from '../../application/ports/payment/IPaymentService';
import { IBillingCatalogService } from '../../application/ports/payment/IBillingCatalogService';
import { PaymentService } from '../../infrastructure/adapters/payment/PaymentService';
import { IStripeSubscriptionWebhookHandler } from '../../application/ports/payment/IStripeSubscriptionWebhookHandler';
import { StripeSubscriptionWebhookHandler } from '../../infrastructure/webhook/stripe/StripeSubscriptionWebhookHandler';
import { IStripeSessionWebhookHandler } from '../../application/ports/payment/IStripeSessionWebhookHandler';
import { StripeSessionWebhookHandler } from '../../infrastructure/webhook/stripe/StripeSessionWebhookHandler';
import { IStripeWebhookDispatcher } from '../../application/ports/payment/IStripeWebhookDispatcher';
import { StripeWebhookDispatcher } from '../../infrastructure/webhook/StripeWebhookDispatcher';
import { ISocketService } from '../../application/ports/socket/ISocketService';
import { SocketService } from '../../infrastructure/adapters/socket/SocketService';
import { StripeRefundRetryService } from '../../application/services/StripeRefundRetryService';
import { ILoggerService } from '../../application/ports/logging/ILoggerService';
import { LoggingService } from '../../infrastructure/adapters/logging/LoggingService';
import { RoomSocketHandler } from '../../presentation/socket/RoomSocketHandler';
import { IPresenceService } from '../../application/ports/presence/IPresenceService';
import { PresenceService } from '../../infrastructure/adapters/socket/PresenceService';
import { HocuspocusService } from '../../infrastructure/realtime/HocuspocusService';
import { HocuspocusHookHandler } from '../../presentation/collaboration/HocuspocusHookHandler';
import { ChatSocketHandler } from '../../presentation/socket/ChatSocketHandler';
import { PollSocketHandler } from '../../presentation/socket/PollSocketHandler';
import { PresenceSocketHandler } from '../../presentation/socket/PresenceSocketHandler';
import { IRoomEventEmitter } from '../../application/ports/realtime/IRoomEventEmitter';
import { RoomEventEmitter } from '../../infrastructure/realtime/RoomEventEmitter';
import { PermissionService } from '../../domain/services/PermissionService';
import { RoomLifecycleTransitionService } from '../../domain/services/RoomLifecycleTransitionService';
import { IMessageQueueService } from '../../application/ports/queue/IMessageQueueService';
import { RabbitMQService } from '../../infrastructure/adapters/queue/RabbitMQService';
import { ISessionActivationPublisher } from '../../application/ports/queue/ISessionActivationPublisher';
import { SessionActivationPublisher } from '../../infrastructure/queue/publisher/SessionActivationPublisher';
import { SessionActivationConsumer } from '../../infrastructure/queue/consumer/SessionActivationConsumer';
import { SessionActivationDlqConsumer } from '../../infrastructure/queue/consumer/SessionActivationDlqConsumer';
import { IRoomLifecyclePublisher } from '../../application/ports/queue/IRoomLifecyclePublisher';
import { RoomLifecyclePublisher } from '../../infrastructure/queue/publisher/RoomLifecyclePublisher';
import { RoomLifecycleConsumer } from '../../infrastructure/queue/consumer/RoomLifecycleConsumer';
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';
import { RoomInviteService } from '../../application/services/RoomInviteService';
import { EntitlementResolutionService } from '../../application/services/EntitlementsResolutionService';
import { RoomFeatureSnapshotFactory } from '../../application/services/RoomFeatureSnapshotFactory';
import { ICodeExecutionService } from '../../application/ports/code/ICodeExecutionService';
import { Judge0Adapter } from '../../infrastructure/adapters/code/Judge0Adapter';
import { INotificationService } from '../../application/ports/notifications/INotificationService';
import { NotificationService } from '../../application/services/NotificationService';

export class ServiceModule {
  static registerModules(): void {
    container.register<ICacheService>('ICacheService', {
      useClass: CacheService,
    });

    container.register<IEmailService>('IEmailService', {
      useClass: MailService,
    });

    container.register<IEmailTemplateFactory>('IEmailTemplateFactory', {
      useClass: TemplateFactoryImpl,
    });

    container.register<IJWTService>('IJWTService', {
      useClass: JWTService,
    });

    container.register<IHashService>('IHashService', {
      useClass: HashService,
    });

    container.register<IOTPService>('IOTPService', {
      useClass: OTPService,
    });

    container.register<ITokenBlacklistService>('ITokenBlacklistService', {
      useClass: TokenBlacklistService,
    });

    container.register<IGoogleAuthService>('IGoogleAuthService', {
      useClass: GoogleAuthService,
    })

    container.register<IGithubAuthService>('IGithubAuthService', {
      useClass: GitHubAuthService,
    });

    container.register<IAIService>('IAIService', {
      useClass: AIService
    })

    container.register<IRRuleSlotService>('IRRuleSlotService', {
      useClass: RRuleSlotService
    });

    container.register<ISlotConflictService>('ISlotConflictService', {
      useClass: SlotConflictService
    });

    container.register<IWalletService>('IWalletService', {
      useClass: WalletService,
    })

    container.register<IPaymentService>('IPaymentService', {
      useClass: PaymentService,
    });

    container.register<IBillingCatalogService>('IBillingCatalogService', {
      useFactory: (dependencyContainer) =>
        dependencyContainer.resolve(PaymentService),
    });

    container.register<IStripeSubscriptionWebhookHandler>('IStripeSubscriptionWebhookHandler', {
      useClass: StripeSubscriptionWebhookHandler,
    });

    container.register<IStripeSessionWebhookHandler>('IStripeSessionWebhookHandler', {
      useClass: StripeSessionWebhookHandler,
    });

    container.register<IStripeWebhookDispatcher>('IStripeWebhookDispatcher', {
      useClass: StripeWebhookDispatcher,
    });

    container.register<ICodeExecutionService>('ICodeExecutionService', {
      useClass: Judge0Adapter,
    });

    container.registerSingleton<ISocketService>('ISocketService', SocketService);
    
    container.registerSingleton<IRoomEventEmitter>(
      'IRoomEventEmitter',
      RoomEventEmitter,
    );

    container.registerSingleton<IPresenceService>('IPresenceService', PresenceService);

    container.register(RoomSocketHandler, {
      useClass: RoomSocketHandler,
    });

    container.register(ChatSocketHandler, {
      useClass: ChatSocketHandler,
    });

    container.register(PresenceSocketHandler, {
      useClass: PresenceSocketHandler,
    });

    container.register(PollSocketHandler, {
      useClass: PollSocketHandler,
    });

    container.register(HocuspocusHookHandler, {
      useClass: HocuspocusHookHandler,
    });

    container.register('PermissionService', {
      useClass: PermissionService
    })
    container.registerSingleton<ILoggerService>('ILoggerService',LoggingService);

    container.registerSingleton(HocuspocusService, HocuspocusService);
    
    container.registerSingleton(StripeRefundRetryService, StripeRefundRetryService);
    
    container.registerSingleton<IMessageQueueService>('IMessageQueueService', RabbitMQService);
    container.registerSingleton<ISessionActivationPublisher>('ISessionActivationPublisher', SessionActivationPublisher);
    container.registerSingleton<IRoomLifecyclePublisher>('IRoomLifecyclePublisher', RoomLifecyclePublisher);
    container.registerSingleton(SessionActivationConsumer);
    container.registerSingleton(SessionActivationDlqConsumer);
    container.registerSingleton(RoomLifecycleConsumer);

    // ── Domain Services ────────────────────────────────────────────────────────
    container.registerSingleton(PermissionService, PermissionService);
    container.registerSingleton(
      RoomLifecycleTransitionService,
      RoomLifecycleTransitionService,
    );
    container.registerSingleton(RoomAuthorizationService, RoomAuthorizationService);
    container.register('frontendUrl', { useValue: env.frontendUrl ?? 'http://localhost:5173' });
    container.register('invitePepper', { useValue: env.secretKey ?? 'codehive-invite' });
    container.registerSingleton(RoomInviteService, RoomInviteService);
    container.registerSingleton(RoomFeatureSnapshotFactory, RoomFeatureSnapshotFactory);
    container.registerSingleton<INotificationService>('INotificationService', NotificationService);
  }
}

