import { container } from 'tsyringe';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { QuestionRepository } from '../../infrastructure/database/repository/QuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { AnswerRepository } from '../../infrastructure/database/repository/AnswerRepository';
import { ISavedQuestionRepository } from '../../domain/interfaces/ISavedQuestionRepository';
import { SavedQuestionRepository } from '../../infrastructure/database/repository/SavedQuestionRepository';
import { IQuestionViewRepository } from '../../domain/interfaces/IQuestionViewRepository';
import { QuestionViewRepository } from '../../infrastructure/database/repository/QuestionViewRepository';
import { IVoteRepository } from '../../domain/interfaces/IVoteRepository';
import { VoteRepository } from '../../infrastructure/database/repository/VoteRepository';
import { ISavedListRepository } from '../../domain/interfaces/ISavedListRepository';
import { SavedListRepository } from '../../infrastructure/database/repository/SavedListRepository';
import { ISavedListItemRepository } from '../../domain/interfaces/ISavedListItemRepository';
import { SavedListItemRepository } from '../../infrastructure/database/repository/SavedListItemRepository';
import { IAiChatSessionRepository } from '../../domain/interfaces/IAiChatSessionRepository';
import { AiChatSessionRepository } from '../../infrastructure/database/repository/AiChatSessionRepository';
import { IAiChatMessageRepository } from '../../domain/interfaces/IAiChatMessageRepository';
import { AiChatMessageRepository } from '../../infrastructure/database/repository/AiChatMessageRepository';
import { IMentorAvailabilityRepository } from '../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityRepository } from '../../infrastructure/database/repository/MentorAvailabilityRepository';
import { ISessionRepository } from '../../domain/interfaces/ISessionReposiotry';
import { SessionRepository } from '../../infrastructure/database/repository/SessionRepository';
import { IWalletRepository } from '../../domain/interfaces/IWalletRepository';
import { WalletRepository } from '../../infrastructure/database/repository/WalletRepository';
import { IStripeWebhookEventRepository } from '../../domain/interfaces/IStripeWebhookEventRepository';
import { StripeWebhookEventRepository } from '../../infrastructure/database/repository/StripeWebhookEventRepository';
import { IBookingReservationRepository } from '../../domain/interfaces/IBookingReservationRepository';
import { BookingReservationRepository } from '../../infrastructure/database/repository/BookingReservationRepository';
import { IMentorRepository } from '../../domain/interfaces/IMentorRepository';
import { MentorRepository } from '../../infrastructure/database/repository/MentorRepository';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { RoomRepository } from '../../infrastructure/database/repository/RoomRepository';
import { IParticipantRepository } from '../../domain/interfaces/IParticipantRepository';
import { ParticipantRepository } from '../../infrastructure/database/repository/ParticipantRepository';
import { IRoomInviteRepository } from '../../domain/interfaces/IRoomInviteRepository';
import { RoomInviteRepository } from '../../infrastructure/database/repository/RoomInviteRepository';
import { IRoomBanRepository } from '../../domain/interfaces/IRoomBanRepository';
import { RoomBanRepository } from '../../infrastructure/database/repository/RoomBanRepository';
import { IRoomReportRepository } from '../../domain/interfaces/IRoomReportRepository';
import { RoomReportRepository } from '../../infrastructure/database/repository/RoomReportRepository';
import { IMessageRepository } from '../../domain/interfaces/IMessageRepository';
import { MessageRepository } from '../../infrastructure/database/repository/MessageRepository';
import { IPollRepository } from '../../domain/interfaces/IPollRepository';
import { PollRepository } from '../../infrastructure/database/repository/PollRepository';
import { IPlanRepository } from '../../domain/interfaces/IPlanRepository';
import { PlanRepository } from '../../infrastructure/database/repository/PlanRepository';
import { IPrivateNoteRepository } from '../../domain/interfaces/IPrivateNoteRepository';
import { PrivateNoteRepository } from '../../infrastructure/database/repository/PrivateNoteRepository';
import { PublicNoteRepository } from '../../infrastructure/database/repository/PublicNoteRepository';
import { IPublicNoteRepository } from '../../domain/interfaces/IPublicNoteRepository';
import { ISubscriptionRepository } from '../../domain/interfaces/ISubscriptionRepository';
import { SubscriptionRepository } from '../../infrastructure/database/repository/SubscriptionRepository';
import { IAdminDashboardRepository } from '../../domain/interfaces/IAdminDashboardRepository';
import { AdminDashboardRepository } from '../../infrastructure/database/repository/AdminDashboardRepository';
import { INotificationRepository } from '../../domain/interfaces/INotificationRepository';
import { NotificationRepository } from '../../infrastructure/database/repository/NotificationRepository';

export class RepositoryModule {
  static registerModules(): void {
    container.register<INotificationRepository>('INotificationRepository', {
      useClass: NotificationRepository
    });

    //-------------------------------UserRepo--------------------------------------//

    container.register<IUserRepository>('IUserRepository', {
      useClass: UserRepository
    });

    container.register<IAdminDashboardRepository>('IAdminDashboardRepository', {
      useClass: AdminDashboardRepository
    });

    //-------------------------------QuestionRepo----------------------------------//

    container.register<IQuestionRepository>('IQuestionRepository', {
      useClass: QuestionRepository
    });

    //------------------------------AnswerRepo------------------------------------//

    container.register<IAnswerRepository>('IAnswerRepository', {
      useClass: AnswerRepository
    });

    //-------------------------Saved Question Repository------------------------//

    container.register<ISavedQuestionRepository>('ISavedQuestionRepository', {
      useClass: SavedQuestionRepository
    });

    container.register<ISavedListRepository>('ISavedListRepository', {
      useClass: SavedListRepository
    });

    container.register<ISavedListItemRepository>('ISavedListItemRepository', {
      useClass: SavedListItemRepository
    });

    //-------------------------Question View Repository------------------------//

    container.register<IQuestionViewRepository>('IQuestionViewRepository', {
      useClass: QuestionViewRepository
    });

    container.register<IVoteRepository>('IVoteRepository', {
      useClass: VoteRepository
    });

    container.register<IAiChatSessionRepository>('IAiChatSessionRepository', {
      useClass: AiChatSessionRepository
    });

    container.register<IAiChatMessageRepository>('IAiChatMessageRepository', {
      useClass: AiChatMessageRepository
    });

    //-------------------------Room Repository------------------------------//

    container.register<IRoomRepository>('IRoomRepository', {
      useClass: RoomRepository
    });

    container.register<IParticipantRepository>('IParticipantRepository', {
      useClass: ParticipantRepository
    });

    container.register<IRoomInviteRepository>('IRoomInviteRepository', {
      useClass: RoomInviteRepository,
    });

    container.register<IRoomBanRepository>('IRoomBanRepository', {
      useClass: RoomBanRepository,
    });

    container.register<IRoomReportRepository>('IRoomReportRepository', {
      useClass: RoomReportRepository,
    });

    container.register<IMessageRepository>('IMessageRepository', {
      useClass: MessageRepository
    });

    //-------------------------Session Repository------------------------------//

    container.register<IMentorAvailabilityRepository>('IMentorAvailabilityRepository', {
      useClass: MentorAvailabilityRepository
    });


    container.register<ISessionRepository>('ISessionRepository', {
      useClass: SessionRepository
    });

    container.register<IWalletRepository>('IWalletRepository', {
      useClass: WalletRepository
    });

    container.register<IStripeWebhookEventRepository>('IStripeWebhookEventRepository', {
      useClass: StripeWebhookEventRepository
    });

    container.register<IBookingReservationRepository>('IBookingReservationRepository', {
      useClass: BookingReservationRepository
    });

    //-------------------------Mentor Repository--------------------------------------//

    container.register<IMentorRepository>('IMentorRepository', {
      useClass: MentorRepository
    });


    //------------------------Poll Repository----------------------------------------//

    container.register<IPollRepository>('IPollRepository', {
      useClass: PollRepository
    });

    //------------------------Plan Repository----------------------------------------//

    container.register<IPlanRepository>('IPlanRepository', {
      useClass: PlanRepository,
    });

    container.register<ISubscriptionRepository>('ISubscriptionRepository', {
      useClass: SubscriptionRepository,
    });


    //-----------------------Note Repository-----------------------------------//

    container.register<IPrivateNoteRepository>('IPrivateNoteRepository', {
      useClass: PrivateNoteRepository,
    });

    container.register<IPublicNoteRepository>('IPublicNoteRepository', {
      useClass: PublicNoteRepository
    });
  }
}
