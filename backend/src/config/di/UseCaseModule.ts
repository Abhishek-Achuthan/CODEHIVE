import { container } from 'tsyringe';
import { IUserRegisterUseCase } from '../../application/useCase/interface/auth/IUserRegisterUseCase';
import { ISendOTPUseCase } from '../../application/useCase/interface/auth/ISendOTPUseCase';
import { UserRegisterUseCase } from '../../application/useCase/auth/UserRegisterUseCase';
import { SendOTPUseCase } from '../../application/useCase/auth/SendOTPUseCase';
import { IVerifyOTPUseCase } from '../../application/useCase/interface/auth/IVerifyOTPUseCase';
import { VerifyOTPUseCase } from '../../application/useCase/auth/VerifyOTPUseCase';
import { IUserLoginUseCase } from '../../application/useCase/interface/auth/IUserLoginUseCase';
import { UserLoginUseCase } from '../../application/useCase/auth/UserLoginUseCase';
import { IForgotPasswordSendOTPUseCase } from '../../application/useCase/interface/auth/IForgotPasswordSendOTPUseCase';
import { ForgotPasswordSendOTPUseCase } from '../../application/useCase/auth/ForgotPasswordSendOTPUseCase';
import { IForgotPasswordVerifyOTPUseCase } from '../../application/useCase/interface/auth/IForgotPasswordVerifyOTPUseCase';
import { ForgotPasswordVerifyOTPUseCase } from '../../application/useCase/auth/ForgotPasswordVerifyOTPUseCase';
import { IResetPasswordUseCase } from '../../application/useCase/interface/auth/IResetPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/useCase/auth/ResetPasswordUseCase';
import { IListUsersUseCase } from '../../application/useCase/interface/admin/IListUsersUseCase';
import { ListUsersUseCase } from '../../application/useCase/admin/ListUsersUseCase';
import { IUpdateUserStatusUseCase } from '../../application/useCase/interface/admin/IUpdateUserStatusUseCase';
import { UpdateUserStatusUseCase } from '../../application/useCase/admin/UpdateUserStatusUseCase';
import { IUserLogoutUseCase } from '../../application/useCase/interface/auth/IUserLogoutUseCase';
import { UserLogoutUseCase } from '../../application/useCase/auth/UserLogoutUseCase';
import { IRefreshAccessTokenUseCase } from '../../application/useCase/interface/auth/IRefreshAccessTokenUseCase';
import { RefreshAccessTokenUseCase } from '../../application/useCase/auth/RefreshAccessTokenUseCase';
import { IGoogleLoginUseCase } from '../../application/useCase/interface/auth/IGoogleLoginUseCase';
import { GoogleLoginUseCase } from '../../application/useCase/auth/GoogleLoginUseCase';
import { IChangePasswordUseCase } from '../../application/useCase/interface/auth/IChangePasswordUseCase';
import { ChangePasswordUseCase } from '../../application/useCase/auth/ChangePasswordUseCase';
import { IGithubLoginUseCase } from '../../application/useCase/interface/auth/IGithubLoginUseCase';
import { GithubLoginUseCase } from '../../application/useCase/auth/GithubLoginUseCase';
import { IInitiateGithubOAuthUseCase } from '../../application/useCase/interface/auth/IInitiateGithubOAuthUseCase';
import { InitiateGithubOAuthUseCase } from '../../application/useCase/auth/InitiateGithubOAuthUseCase';
import { ICreateQuestionUseCase } from '../../application/useCase/interface/qna/ICreateQuestionUseCase';
import { CreateQuestionUseCase } from '../../application/useCase/qna/createQuestionUseCase';
import { IListQuestionUseCase } from '../../application/useCase/interface/qna/IListQuestionsUseCase';
import { ListQuestionUseCase } from '../../application/useCase/qna/ListQuestionUseCase';
import { IPostAnswerUseCase } from '../../application/useCase/interface/qna/IPostAnswerUseCase';
import { PostAnswerUseCase } from '../../application/useCase/qna/PostAnswerUseCase';
import { IListAnswerUseCase } from '../../application/useCase/interface/qna/IListAnswerUseCase';
import { ListAnswerUseCase } from '../../application/useCase/qna/ListAnswerUseCase';
import { IGetQuestionUseCase } from '../../application/useCase/interface/qna/IGetQuestionUseCase';
import { GetQuestionUseCase } from '../../application/useCase/qna/GetQuestionUseCase';
import { IRelatedQuestionUseCase } from '../../application/useCase/interface/qna/IRelatedQuestionUseCase';
import { RelatedQuestionUseCase } from '../../application/useCase/qna/RelatedQuestionUseCase';
import { IToggleSaveQuestionUseCase } from '../../application/useCase/interface/qna/IToggleSaveQuestionUseCase';
import { ToggleSaveQuestionUseCase } from '../../application/useCase/qna/ToggleSaveQuestionUseCase';
import { IEditQuestionUseCase } from '../../application/useCase/interface/qna/IEditQuestionUseCase';
import { EditQuestionUseCase } from '../../application/useCase/qna/EditQuestionUseCase';
import { IEditAnswerUseCase } from '../../application/useCase/interface/qna/IEditAnswerUseCase';
import { EditAnswerUseCase } from '../../application/useCase/qna/EditAnswerUseCase';
import { IGetAnswerUseCase } from '../../application/useCase/interface/qna/IGetAnswerUseCase';
import { GetAnswerUseCase } from '../../application/useCase/qna/GetAnswerUseCase';
import { IListUserQuestionsUseCase } from '../../application/useCase/interface/qna/IListUserQuestionsUseCase';
import { ListUserQuestionsUseCase } from '../../application/useCase/qna/ListUserQuestionsUseCase';
import { IListAnsweredQuestionUseCase } from '../../application/useCase/interface/qna/IListAnsweredQuestionsUseCase';
import { listAnsweredQuestionUseCase } from '../../application/useCase/qna/ListAnsweredQuestionUseCase';
import { IRecordQuestionViewUseCase } from '../../application/useCase/interface/qna/IRecordQuestionViewUseCase';
import { RecordQuestionViewUseCase } from '../../application/useCase/qna/RecordQuestionViewUseCase';
import { IVoteQuestionUseCase } from '../../application/useCase/interface/qna/IVoteQuestionUseCase';
import { VoteQuestionUseCase } from '../../application/useCase/qna/VoteQuestionUseCase';
import { IVoteAnswerUseCase } from '../../application/useCase/interface/qna/IVoteAnswerUseCase';
import { VoteAnswerUseCase } from '../../application/useCase/qna/VoteAnswerUseCase';
import { ICreateSavedListUseCase } from '../../application/useCase/interface/qna/ICreateSavedListUseCase';
import { CreateSavedListUseCase } from '../../application/useCase/qna/CreateSavedListUseCase';
import { IListSavedListsUseCase } from '../../application/useCase/interface/qna/IListSavedListsUseCase';
import { ListSavedListsUseCase } from '../../application/useCase/qna/ListSavedListsUseCase';
import { IAddQuestionToSavedListUseCase } from '../../application/useCase/interface/qna/IAddQuestionToSavedListUseCase';
import { AddQuestionToSavedListUseCase } from '../../application/useCase/qna/AddQuestionToSavedListUseCase';
import { IRemoveQuestionFromSavedListUseCase } from '../../application/useCase/interface/qna/IRemoveQuestionFromSavedListUseCase';
import { RemoveQuestionFromSavedListUseCase } from '../../application/useCase/qna/RemoveQuestionFromSavedListUseCase';
import { IListSavedQuestionsUseCase } from '../../application/useCase/interface/qna/IListSavedQuestionsUseCase';
import { ListSavedQuestionsUseCase } from '../../application/useCase/qna/ListSavedQuestionsUseCase';
import { IListSavedListQuestionsUseCase } from '../../application/useCase/interface/qna/IListSavedListQuestionsUseCase';
import { ListSavedListQuestionsUseCase } from '../../application/useCase/qna/ListSavedListQuestionsUseCase';
import { IGetSavedListIdsForQuestionUseCase } from '../../application/useCase/interface/qna/IGetSavedListIdsForQuestionUseCase';
import { GetSavedListIdsForQuestionUseCase } from '../../application/useCase/qna/GetSavedListIdsForQuestionUseCase';
import { IDeleteSavedListUseCase } from '../../application/useCase/interface/qna/IDeleteSavedListUseCase';
import { DeleteSavedListUseCase } from '../../application/useCase/qna/DeleteSavedListUseCase';
import { IAcceptAnswerUseCase } from '../../application/useCase/interface/qna/IAcceptAnswerUseCase';
import { AcceptAnswerUseCase } from '../../application/useCase/qna/AcceptAnswerUseCase';
import { IAiAssistantUseCase } from '../../application/useCase/interface/qna/IAiAssistantUseCase';
import { AiAssistantUseCase } from '../../application/useCase/qna/AiAssistantUseCase';
import { ICreateAiChatSessionUseCase } from '../../application/useCase/interface/qna/ICreateAiChatSessionUseCase';
import { CreateAiChatSessionUseCase } from '../../application/useCase/qna/CreateAiChatSessionUseCase';
import { IListAiChatSessionsUseCase } from '../../application/useCase/interface/qna/IListAiChatSessionsUseCase';
import { ListAiChatSessionsUseCase } from '../../application/useCase/qna/ListAiChatSessionsUseCase';
import { IGetAiChatMessagesUseCase } from '../../application/useCase/interface/qna/IGetAiChatMessagesUseCase';
import { GetAiChatMessagesUseCase } from '../../application/useCase/qna/GetAiChatMessagesUseCase';
import { IUpdateUserProfileUseCase } from '../../application/useCase/interface/user/IUpdateUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCase/user/UpdateUserProfileUseCase';
import { IDeleteQuestionUseCase } from '../../application/useCase/interface/qna/IDeleteQuestionUseCase';
import { DeleteQuestionUseCase } from '../../application/useCase/qna/DeleteQuestionUseCase';
import { IDeleteAnswerUseCase } from '../../application/useCase/interface/qna/IDeleteAnswerUseCase';
import { DeleteAnswerUseCase } from '../../application/useCase/qna/DeleteAnswerUseCase';
import { IRemoveAcceptedAnswerUseCase } from '../../application/useCase/interface/qna/IRemoveAcceptedAnswerUseCase';
import { RemoveAcceptedAnswerUseCase } from '../../application/useCase/qna/RemoveAcceptedAnswerUseCase';
import { IUnsaveItemUseCase } from '../../application/useCase/interface/qna/IUnsaveItemUseCase';
import { UnsaveItemUseCase } from '../../application/useCase/qna/UnsaveItemUseCase';
import { IListMentorsUseCase } from '../../application/useCase/interface/session/IListMentorsUseCase';
import { ListMentorsUseCase } from '../../application/useCase/session/ListMentorsUseCase';
import { IGetBookedSessionsUseCase } from '../../application/useCase/interface/session/IGetBookedSessionsUseCase';
import { GetBookedSessionsUseCase } from '../../application/useCase/session/GetBookedSessionsUseCase';
import { ICreateMentorAvailabilityUseCase } from '../../application/useCase/interface/session/ICreateMentorAvailabilityUseCase';
import { CreateMentorAvailabilityUseCase } from '../../application/useCase/session/CreateMentorAvailabilityUseCase';
import { IGetMentorAvailabilityUseCase } from '../../application/useCase/interface/session/IGetMentorAvailabilityUseCase';
import { GetMentorAvailabilityUseCase } from '../../application/useCase/session/GetMentorAvailabilityUseCase';
import { IGetAvailableSlotsUseCase } from '../../application/useCase/interface/session/IGetAvailableSlotsUseCase';
import { GetAvailableSlotsUseCase } from '../../application/useCase/session/GetAvailableSlotsUseCase';
import { IBookSessionUseCase } from '../../application/useCase/interface/session/IBookSessionUseCase';
import { BookSessionUseCase } from '../../application/useCase/session/BookSessionUseCase';


export class UseCaseModule {
  static registerModules(): void {
    //----------------------------------Auth----------------------------------------//

    container.register<IUserRegisterUseCase>('IUserRegisterUseCase', {
      useClass: UserRegisterUseCase,
    });

    container.register<ISendOTPUseCase>('ISendOTPUseCase', {
      useClass: SendOTPUseCase,
    });

    container.register<IVerifyOTPUseCase>('IVerifyOTPUseCase', {
      useClass: VerifyOTPUseCase,
    });

    container.register<IUserLoginUseCase>('IUserLoginUseCase', {
      useClass: UserLoginUseCase,
    });

    container.register<IForgotPasswordSendOTPUseCase>(
      'IForgotPasswordSendOTPUseCase',
      {
        useClass: ForgotPasswordSendOTPUseCase,
      }
    );

    container.register<IForgotPasswordVerifyOTPUseCase>(
      'IForgotPasswordVerifyOTPUseCase',
      {
        useClass: ForgotPasswordVerifyOTPUseCase,
      }
    );

    container.register<IResetPasswordUseCase>('IResetPasswordUseCase', {
      useClass: ResetPasswordUseCase,
    });

    container.register<IChangePasswordUseCase>('IChangePasswordUseCase', {
      useClass: ChangePasswordUseCase,
    });

    container.register<IUserLogoutUseCase>('IUserLogoutUseCase', {
      useClass: UserLogoutUseCase,
    });

    container.register<IRefreshAccessTokenUseCase>(
      'IRefreshAccessTokenUseCase',
      {
        useClass: RefreshAccessTokenUseCase,
      }
    );

    container.register<IGoogleLoginUseCase>('IGoogleLoginUseCase', {
      useClass: GoogleLoginUseCase,
    });

    container.register<IGithubLoginUseCase>('IGithubLoginUseCase', {
      useClass: GithubLoginUseCase,
    });

    container.register<IInitiateGithubOAuthUseCase>('IInitiateGithubOAuthUseCase', {
      useClass: InitiateGithubOAuthUseCase,
    });

    //----------------------------------Admin----------------------------------------//


    container.register<IListUsersUseCase>('IListUsersUseCase', {
      useClass: ListUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>('IUpdateUserStatusUseCase', {
      useClass: UpdateUserStatusUseCase,
    });

    //----------------------------------QnA----------------------------------------//

    container.register<ICreateQuestionUseCase>('ICreateQuestionUseCase', {
      useClass: CreateQuestionUseCase,
    });

    container.register<IListQuestionUseCase>('IListQuestionUseCase', {
      useClass: ListQuestionUseCase,
    });

    container.register<IPostAnswerUseCase>('IPostAnswerUseCase', {
      useClass: PostAnswerUseCase,
    });

    container.register<IListAnswerUseCase>('IListAnswerUseCase', {
      useClass: ListAnswerUseCase,
    });

    container.register<IGetQuestionUseCase>('IGetQuestionUseCase', {
      useClass: GetQuestionUseCase,
    });

    container.register<IRelatedQuestionUseCase>('IRelatedQuestionUseCase', {
      useClass: RelatedQuestionUseCase,
    });

    container.register<IToggleSaveQuestionUseCase>('IToggleSaveQuestionUseCase', {
      useClass: ToggleSaveQuestionUseCase,
    });

    container.register<IUnsaveItemUseCase>('IUnsaveItemUseCase',{
      useClass: UnsaveItemUseCase,
    })

    container.register<IEditQuestionUseCase>('IEditQuestionUseCase', {
      useClass: EditQuestionUseCase,
    });

    container.register<IEditAnswerUseCase>('IEditAnswerUseCase', {
      useClass: EditAnswerUseCase,
    });

    container.register<IGetAnswerUseCase>('IGetAnswerUseCase', {
      useClass: GetAnswerUseCase,
    });

    container.register<IListUserQuestionsUseCase>('IListUserQuestionsUseCase', {
      useClass: ListUserQuestionsUseCase
    });

    container.register<IListAnsweredQuestionUseCase>('IListAnsweredQuestionUseCase', {
      useClass: listAnsweredQuestionUseCase
    });

    container.register<IRecordQuestionViewUseCase>('IRecordQuestionViewUseCase', {
      useClass: RecordQuestionViewUseCase,
    });

    container.register<IVoteQuestionUseCase>('IVoteQuestionUseCase', {
      useClass: VoteQuestionUseCase,
    });

    container.register<IVoteAnswerUseCase>('IVoteAnswerUseCase', {
      useClass: VoteAnswerUseCase,
    });

    container.register<ICreateSavedListUseCase>('ICreateSavedListUseCase', {
      useClass: CreateSavedListUseCase,
    });

    container.register<IListSavedListsUseCase>('IListSavedListsUseCase', {
      useClass: ListSavedListsUseCase,
    });

    container.register<IAddQuestionToSavedListUseCase>('IAddQuestionToSavedListUseCase', {
      useClass: AddQuestionToSavedListUseCase,
    });

    container.register<IRemoveQuestionFromSavedListUseCase>('IRemoveQuestionFromSavedListUseCase', {
      useClass: RemoveQuestionFromSavedListUseCase,
    });

    container.register<IListSavedQuestionsUseCase>('IListSavedQuestionsUseCase', {
      useClass: ListSavedQuestionsUseCase,
    });

    container.register<IListSavedListQuestionsUseCase>('IListSavedListQuestionsUseCase', {
      useClass: ListSavedListQuestionsUseCase,
    });

    container.register<IGetSavedListIdsForQuestionUseCase>(
      'IGetSavedListIdsForQuestionUseCase',
      {
        useClass: GetSavedListIdsForQuestionUseCase,
      }
    );

    container.register<IDeleteSavedListUseCase>('IDeleteSavedListUseCase', {
      useClass: DeleteSavedListUseCase,
    });

    container.register<IAcceptAnswerUseCase>('IAcceptAnswerUseCase', {
      useClass: AcceptAnswerUseCase,
    });

    container.register<IAiAssistantUseCase>('IAiAssistantUseCase', {
      useClass: AiAssistantUseCase
    })

    container.register<ICreateAiChatSessionUseCase>('ICreateAiChatSessionUseCase', {
      useClass: CreateAiChatSessionUseCase,
    });

    container.register<IListAiChatSessionsUseCase>('IListAiChatSessionsUseCase', {
      useClass: ListAiChatSessionsUseCase,
    });

    container.register<IGetAiChatMessagesUseCase>('IGetAiChatMessagesUseCase', {
      useClass: GetAiChatMessagesUseCase,
    });

    container.register<IUpdateUserProfileUseCase>('IUpdateUserProfileUseCase', {
      useClass: UpdateUserProfileUseCase,
    });

    container.register<IDeleteQuestionUseCase>('IDeleteQuestionUseCase', {
      useClass: DeleteQuestionUseCase
    });

    container.register<IDeleteAnswerUseCase>('IDeleteAnswerUseCase', {
      useClass: DeleteAnswerUseCase
    })

    container.register<IRemoveAcceptedAnswerUseCase>('IRemoveAcceptedAnswerUseCase', {
      useClass: RemoveAcceptedAnswerUseCase,
    });

    //---------------------------------Session---------------------------------------//

    container.register<IListMentorsUseCase>('IListMentorsUseCase', {
      useClass: ListMentorsUseCase
    });

    container.register<IGetBookedSessionsUseCase>('IGetBookedSessionsUseCase', {
      useClass: GetBookedSessionsUseCase
    });

    container.register<ICreateMentorAvailabilityUseCase>('ICreateMentorAvailabilityUseCase', {
      useClass: CreateMentorAvailabilityUseCase
    });

    container.register<IGetAvailableSlotsUseCase>('IGetAvailableSlotsUseCase', {
      useClass: GetAvailableSlotsUseCase
    });

    container.register<IGetMentorAvailabilityUseCase>('IGetMentorAvailabilityUseCase', {
      useClass: GetMentorAvailabilityUseCase
    });

    container.register<IBookSessionUseCase>('IBookSessionUseCase', {
      useClass: BookSessionUseCase
    });

  }
}
