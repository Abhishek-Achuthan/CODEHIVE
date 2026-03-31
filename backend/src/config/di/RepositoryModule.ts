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

export class RepositoryModule {
    static registerModules(): void {

        //-------------------------------UserRepo--------------------------------------//

        container.register<IUserRepository>('IUserRepository', {
            useClass: UserRepository
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
        })
    }
}
