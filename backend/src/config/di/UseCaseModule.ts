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
import { IListMentorsUseCase } from '../../application/useCase/interface/mentor/IListMentorsUseCase';
import { ListMentorsUseCase } from '../../application/useCase/mentor/ListMentorsUseCase';
import { IGetBookedSessionsUseCase } from '../../application/useCase/interface/session/IGetBookedSessionsUseCase';
import { GetBookedSessionsUseCase } from '../../application/useCase/session/GetBookedSessionsUseCase';
import { IAddReviewUseCase } from '../../application/useCase/interface/session/IAddReviewUseCase';
import { AddReviewUseCase } from '../../application/useCase/session/AddReviewUseCase';
import { IGetMentorInsightsUseCase } from '../../application/useCase/interface/session/IGetMentorInsightsUseCase';
import { GetMentorInsightsUseCase } from '../../application/useCase/session/GetMentorInsightsUseCase';
import { IGetMentorReviewsUseCase } from '../../application/useCase/interface/session/IGetMentorReviewsUseCase';
import { GetMentorReviewsUseCase } from '../../application/useCase/session/GetMentorReviewsUseCase';
import { ICreateMentorAvailabilityUseCase } from '../../application/useCase/interface/mentor/ICreateMentorAvailabilityUseCase';
import { CreateMentorAvailabilityUseCase } from '../../application/useCase/mentor/CreateMentorAvailabilityUseCase';
import { IGetMentorAvailabilityUseCase } from '../../application/useCase/interface/mentor/IGetMentorAvailabilityUseCase';
import { GetMentorAvailabilityUseCase } from '../../application/useCase/mentor/GetMentorAvailabilityUseCase';
import { IGetAvailableSlotsUseCase } from '../../application/useCase/interface/session/IGetAvailableSlotsUseCase';
import { GetAvailableSlotsUseCase } from '../../application/useCase/session/GetAvailableSlotsUseCase';
import { IBookSessionWithStripeUseCase } from '../../application/useCase/interface/session/IBookSessionWithStripeUseCase';
import { BookSessionWithStripeUseCase } from '../../application/useCase/session/BookSessionWithStripeUseCase';
import { IBookSessionWithWalletUseCase } from '../../application/useCase/interface/session/IBookSessionWithWalletUseCase';
import { BookSessionWithWalletUseCase } from '../../application/useCase/session/BookSessionWithWalletUseCase';
import { IHandleStripeWebhookUseCase } from '../../application/useCase/interface/payment/IHandleStripeWebhookUseCase';
import { HandleStripeWebhookUseCase } from '../../application/useCase/payment/HandleStripeWebhookUseCase';
import { IGetMyWalletUseCase } from '../../application/useCase/interface/wallet/IGetMyWalletUseCase';
import { GetMyWalletUseCase } from '../../application/useCase/wallet/GetMyWalletUseCase';
import { IGetWalletTransactionsUseCase } from '../../application/useCase/interface/wallet/IGetWalletTransactionsUseCase';
import { GetWalletTransactionsUseCase } from '../../application/useCase/wallet/GetWalletTransactionsUseCase';
import { ICancelSessionUseCase } from '../../application/useCase/interface/session/ICancelSessionUseCase';
import { CancelSessionUseCase } from '../../application/useCase/session/CancelSessionUseCase';
import { ICancelBookingReservationUseCase } from '../../application/useCase/interface/session/ICancelBookingReservationUseCase';
import { CancelBookingReservationUseCase } from '../../application/useCase/session/CancelBookingReservationUseCase';
import { IGetBookingReservationStatusUseCase } from '../../application/useCase/interface/session/IGetBookingReservationStatusUseCase';
import { GetBookingReservationStatusUseCase } from '../../application/useCase/session/GetBookingReservationStatusUseCase';
import { IDeleteMentorAvailabilityUseCase } from '../../application/useCase/interface/mentor/IDeleteMentorAvailabilityUseCase';
import { DeleteMentorAvailabilityUseCase } from '../../application/useCase/mentor/DeleteMentorAvailabilityUseCase';
import { IAddAvailabilityExceptionUseCase } from '../../application/useCase/interface/mentor/IAddAvailabilityExceptionUseCase';
import { AddAvailabilityExceptionUseCase } from '../../application/useCase/mentor/AddAvailabilityExceptionUseCase';
import { IApplyForMentorUseCase } from '../../application/useCase/interface/user/IApplyForMentorUseCase';
import { ApplyForMentorUseCase } from '../../application/useCase/user/ApplyForMentorUseCase';
import { IGetUserActivityUseCase } from '../../application/useCase/interface/user/IGetUserActivityUseCase';
import { GetUserActivityUseCase } from '../../application/useCase/user/GetUserActivityUseCase';
import { IListMentorApplicationUseCase } from '../../application/useCase/interface/admin/IListMentorApplicationUseCase';
import { ListMentorApplicationUseCase } from '../../application/useCase/admin/ListMentorApplicationUseCase';
import { type IUpdateMentorStatusUseCase } from '../../application/useCase/interface/admin/IUpdateMentorStatusUseCase';
import { IGetAdminReportsUseCase } from '../../application/useCase/admin/GetAdminReportsUseCase';
import { GetAdminReportsUseCase } from '../../application/useCase/admin/GetAdminReportsUseCase';
import { IUpdateReportStatusUseCase } from '../../application/useCase/admin/UpdateReportStatusUseCase';
import { UpdateReportStatusUseCase } from '../../application/useCase/admin/UpdateReportStatusUseCase';
import { IGetAdminRoomChatHistoryUseCase } from '../../application/useCase/admin/GetAdminRoomChatHistoryUseCase';
import { GetAdminRoomChatHistoryUseCase } from '../../application/useCase/admin/GetAdminRoomChatHistoryUseCase';
import { IBanUserUseCase } from '../../application/useCase/admin/BanUserUseCase';
import { BanUserUseCase } from '../../application/useCase/admin/BanUserUseCase';
import { IUnbanUserUseCase } from '../../application/useCase/admin/UnbanUserUseCase';
import { UnbanUserUseCase } from '../../application/useCase/admin/UnbanUserUseCase';
import { IWarnUserUseCase, WarnUserUseCase } from '../../application/useCase/admin/WarnUserUseCase';
import { IGetDashboardMetricsUseCase } from '../../application/useCase/admin/GetDashboardMetricsUseCase';
import { GetDashboardMetricsUseCase } from '../../application/useCase/admin/GetDashboardMetricsUseCase';
import { UpdateMentorStatusUseCase } from '../../application/useCase/admin/UpdateMentorStatusUseCase';
import { IViewMentorProfileUseCase } from '../../application/useCase/interface/mentor/IViewMentorProfileUseCase';
import { ViewMentorProfileUseCase } from '../../application/useCase/mentor/ViewMentorProfileUseCase';
import { ICreateRoomUseCase } from '../../application/useCase/interface/room/ICreateRoomUseCase';
import { CreateRoomUseCase } from '../../application/useCase/room/CreateRoomUseCase';
import { IJoinRoomUseCase } from '../../application/useCase/interface/room/IJoinRoomUseCase';
import { JoinRoomUseCase } from '../../application/useCase/room/JoinRoomUseCase';
import { ISendMessageUseCase } from '../../application/useCase/interface/message/ISendMessageUseCase';
import { SendMessageUseCase } from '../../application/useCase/message/SendMessageUseCase';
import { IEditMessageUseCase } from '../../application/useCase/interface/message/IEditMessageUseCase';
import { EditMessageUseCase } from '../../application/useCase/message/EditMessageUseCase';
import { IDeleteMessageUseCase } from '../../application/useCase/interface/message/IDeleteMessageUseCase';
import { DeleteMessageUseCase } from '../../application/useCase/message/DeleteMessageUseCase';
import { IGetPublicRoomsUseCase } from '../../application/useCase/interface/room/IGetPublicRoomsUseCase';
import { GetPublicRoomsUseCase } from '../../application/useCase/room/GetPublicRoomsUseCase';
import { IGetMyRoomsUseCase } from '../../application/useCase/interface/room/IGetMyRoomsUseCase';
import { GetMyRoomsUseCase } from '../../application/useCase/room/GetMyRoomsUseCase';
import { ILeaveRoomUseCase } from '../../application/useCase/interface/room/ILeaveRoomUseCase';
import { LeaveRoomUseCase } from '../../application/useCase/room/LeaveRoomUseCase';
import { ICreateRoomInviteUseCase } from '../../application/useCase/interface/room/ICreateRoomInviteUseCase';
import { CreateRoomInviteUseCase } from '../../application/useCase/room/CreateRoomInviteUseCase';
import { IRegenerateRoomInviteUseCase } from '../../application/useCase/interface/room/IRegenerateRoomInviteUseCase';
import { RegenerateRoomInviteUseCase } from '../../application/useCase/room/RegenerateRoomInviteUseCase';
import { IRevokeRoomInviteUseCase } from '../../application/useCase/interface/room/IRevokeRoomInviteUseCase';
import { RevokeRoomInviteUseCase } from '../../application/useCase/room/RevokeRoomInviteUseCase';
import { IListRoomInvitesUseCase } from '../../application/useCase/interface/room/IListRoomInvitesUseCase';
import { ListRoomInvitesUseCase } from '../../application/useCase/room/ListRoomInvitesUseCase';
import { IPreviewInviteUseCase } from '../../application/useCase/interface/room/IPreviewInviteUseCase';
import { PreviewInviteUseCase } from '../../application/useCase/room/PreviewInviteUseCase';
import { IJoinRoomViaInviteUseCase } from '../../application/useCase/interface/room/IJoinRoomViaInviteUseCase';
import { JoinRoomViaInviteUseCase } from '../../application/useCase/room/JoinRoomViaInviteUseCase';
import { IKickParticipantUseCase } from '../../application/useCase/interface/room/IKickParticipantUseCase';
import { IGetRoomSettingsUseCase } from '../../application/useCase/interface/room/IGetRoomSettingsUseCase';
import { GetRoomSettingsUseCase } from '../../application/useCase/room/GetRoomSettingsUseCase';
import { KickParticipantUseCase } from '../../application/useCase/room/KickParticipantUseCase';
import { IUpdateParticipantOverridesUseCase } from '../../application/useCase/interface/room/IUpdateParticipantOverridesUseCase';
import { UpdateParticipantOverridesUseCase } from '../../application/useCase/room/UpdateParticipantOverridesUseCase';
import { IReportParticipantUseCase } from '../../application/useCase/interface/room/IReportParticipantUseCase';
import { ReportParticipantUseCase } from '../../application/useCase/room/ReportParticipantUseCase';
import { IEndRoomUseCase } from '../../application/useCase/interface/room/IEndRoomUseCase';
import { EndRoomUseCase } from '../../application/useCase/room/EndRoomUseCase';
import { IAuthenticateRealtimeUserUseCase } from '../../application/useCase/interface/realtime/IAuthenticateRealtimeUserUseCase';
import { AuthenticateRealtimeUserUseCase } from '../../application/useCase/realtime/AuthenticateRealtimeUserUseCase';
import { IAuthorizeCollaborationAccessUseCase } from '../../application/useCase/interface/realtime/IAuthorizeCollaborationAccessUseCase';
import { AuthorizeCollaborationAccessUseCase } from '../../application/useCase/realtime/AuthorizeCollaborationAccessUseCase';
import { IAuthorizeCollaborationWriteUseCase } from '../../application/useCase/interface/realtime/IAuthorizeCollaborationWriteUseCase';
import { AuthorizeCollaborationWriteUseCase } from '../../application/useCase/realtime/AuthorizeCollaborationWriteUseCase';
import { ICreatePollUseCase } from '../../application/useCase/interface/poll/ICreatePollUseCase';
import { CreatePollUseCase } from '../../application/useCase/poll/CreatePollUseCase';
import { ISubmitPollVoteUseCase } from '../../application/useCase/interface/poll/ISubmitPollVoteUseCase';
import { SubmitPollVoteUseCase } from '../../application/useCase/poll/SubmitPollVoteUseCase';
import { IGetActivePollUseCase } from '../../application/useCase/interface/poll/IGetActivePollUseCase';
import { GetActivePollUseCase } from '../../application/useCase/poll/GetActivePollUseCase';
import { IClosePollUseCase } from '../../application/useCase/interface/poll/IClosePollUseCase';
import { ClosePollUseCase } from '../../application/useCase/poll/ClosePollUseCase';
import { ISavePrivateNoteUseCase } from '../../application/useCase/interface/notes/privateNote/ISavePrivateNoteUseCase';
import { SavePrivateNoteUseCase } from '../../application/useCase/notes/privateNote/SavePrivateNoteUseCase';
import { IGetPrivateNoteUseCase } from '../../application/useCase/interface/notes/privateNote/IGetPrivateNoteUseCase';
import { GetPrivateNoteUseCase } from '../../application/useCase/notes/privateNote/GetPrivateNoteUseCase';
import { GetPublicNoteUseCase } from '../../application/useCase/notes/publicNote/GetPublicNoteUseCase';
import { IGetPublicNoteUseCase } from '../../application/useCase/interface/notes/privateNote/IGetPublicNoteUseCase';
import { ISavePublicNoteUseCase } from '../../application/useCase/interface/notes/ISavePublicNoteUseCase';
import { SavePublicNoteUseCase } from '../../application/useCase/notes/publicNote/SavePublicNoteUseCase';
import { IActivateUpcomingSessionUseCase } from '../../application/useCase/interface/room/IActivateUpcomingSessionRoomsUseCase';
import { ActivateUpcomingSessionUseCase } from '../../application/useCase/session/ActivateUpcomingSessionUseCase';
import { ITransitionRoomLifecycleUseCase } from '../../application/useCase/interface/room/ITransitionRoomLifecycleUseCase';
import { TransitionRoomLifecycleUseCase } from '../../application/useCase/room/TransitionRoomLifecycleUseCase';
import { ICreatePlanUseCase } from '../../application/useCase/interface/plan/ICreatePlanUseCase';
import { CreatePlanUseCase } from '../../application/useCase/plan/CreatePlanUseCase';
import { IUpdatePlanUseCase } from '../../application/useCase/interface/plan/IUpdatePlanUseCase';
import { UpdatePlanUseCase } from '../../application/useCase/plan/UpdatePlanUseCase';
import { IListActivePlansUseCase } from '../../application/useCase/interface/plan/IListActivePlansUseCase';
import { ListActivePlansUseCase } from '../../application/useCase/plan/ListActivePlansUseCase';
import { IGetPlanByIdUseCase } from '../../application/useCase/interface/plan/IGetPlanByIdUseCase';
import { GetPlanByIdUseCase } from '../../application/useCase/plan/GetPlanByIdUseCase';
import { ListAllPlansUseCase } from '../../application/useCase/plan/ListAllPlansUseCase';
import { IGetPlanBySlugUseCase } from '../../application/useCase/interface/plan/IGetPlanBySlugUseCase';
import { GetPlanBySlugUseCase } from '../../application/useCase/plan/GetPlanBySlugUseCase';
import { IArchivePlanUseCase } from '../../application/useCase/interface/plan/IArchivePlanUseCase';
import { ArchivePlanUseCase } from '../../application/useCase/plan/ArchivePlanUseCase';
import { ISyncPlanStripeCatalogUseCase } from '../../application/useCase/interface/plan/ISyncPlanStripeCatalogUseCase';
import { SyncPlanStripeCatalogUseCase } from '../../application/useCase/plan/SyncPlanStripeCatalogUseCase';
import { IResolveUserEntitlementsUseCase } from '../../application/useCase/interface/entitlement/IResolveUserEntitlementsUseCase';
import { ResolveUserEntitlementsUseCase } from '../../application/useCase/entitlement/ResolveUserEntitlementsUseCase';
import { ICreateSubscriptionCheckoutSessionUseCase } from '../../application/useCase/interface/subscription/ICreateSubscriptionCheckoutSessionUseCase';
import { CreateSubscriptionCheckoutSessionUseCase } from '../../application/useCase/subscription/CreateSubscriptionCheckoutSessionUseCase';
import { GetActiveSubscriptionUseCase } from '../../application/useCase/subscription/GetActiveSubscriptionUseCase';
import { IGetActiveSubscriptionUseCase } from '../../application/useCase/interface/subscription/IGetActiveSubscriptionUseCase';

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
      },
    );

    container.register<IForgotPasswordVerifyOTPUseCase>(
      'IForgotPasswordVerifyOTPUseCase',
      {
        useClass: ForgotPasswordVerifyOTPUseCase,
      },
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
      },
    );

    container.register<IGoogleLoginUseCase>('IGoogleLoginUseCase', {
      useClass: GoogleLoginUseCase,
    });

    container.register<IGithubLoginUseCase>('IGithubLoginUseCase', {
      useClass: GithubLoginUseCase,
    });

    container.register<IInitiateGithubOAuthUseCase>(
      'IInitiateGithubOAuthUseCase',
      {
        useClass: InitiateGithubOAuthUseCase,
      },
    );

    //----------------------------------Admin----------------------------------------//

    container.register<IListUsersUseCase>('IListUsersUseCase', {
      useClass: ListUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>('IUpdateUserStatusUseCase', {
      useClass: UpdateUserStatusUseCase,
    });

    container.register<IListMentorApplicationUseCase>(
      'IListMentorApplicationUseCase',
      {
        useClass: ListMentorApplicationUseCase,
      },
    );

    container.register<IUpdateMentorStatusUseCase>(
      'IUpdateMentorStatusUseCase',
      {
        useClass: UpdateMentorStatusUseCase,
      },
    );

    container.register<IGetAdminReportsUseCase>('IGetAdminReportsUseCase', {
      useClass: GetAdminReportsUseCase,
    });

    container.register<IUpdateReportStatusUseCase>('IUpdateReportStatusUseCase', {
      useClass: UpdateReportStatusUseCase,
    });

    container.register<IGetAdminRoomChatHistoryUseCase>('IGetAdminRoomChatHistoryUseCase', {
      useClass: GetAdminRoomChatHistoryUseCase,
    });

    container.register<IBanUserUseCase>('IBanUserUseCase', {
      useClass: BanUserUseCase,
    });

    container.register<IUnbanUserUseCase>('IUnbanUserUseCase', {
      useClass: UnbanUserUseCase,
    });

    container.register<IWarnUserUseCase>('IWarnUserUseCase', {
      useClass: WarnUserUseCase,
    });

    container.register<IGetDashboardMetricsUseCase>('IGetDashboardMetricsUseCase', {
      useClass: GetDashboardMetricsUseCase,
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

    container.register<IToggleSaveQuestionUseCase>(
      'IToggleSaveQuestionUseCase',
      {
        useClass: ToggleSaveQuestionUseCase,
      },
    );

    container.register<IUnsaveItemUseCase>('IUnsaveItemUseCase', {
      useClass: UnsaveItemUseCase,
    });

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
      useClass: ListUserQuestionsUseCase,
    });

    container.register<IListAnsweredQuestionUseCase>(
      'IListAnsweredQuestionUseCase',
      {
        useClass: listAnsweredQuestionUseCase,
      },
    );

    container.register<IRecordQuestionViewUseCase>(
      'IRecordQuestionViewUseCase',
      {
        useClass: RecordQuestionViewUseCase,
      },
    );

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

    container.register<IAddQuestionToSavedListUseCase>(
      'IAddQuestionToSavedListUseCase',
      {
        useClass: AddQuestionToSavedListUseCase,
      },
    );

    container.register<IRemoveQuestionFromSavedListUseCase>(
      'IRemoveQuestionFromSavedListUseCase',
      {
        useClass: RemoveQuestionFromSavedListUseCase,
      },
    );

    container.register<IListSavedQuestionsUseCase>(
      'IListSavedQuestionsUseCase',
      {
        useClass: ListSavedQuestionsUseCase,
      },
    );

    container.register<IListSavedListQuestionsUseCase>(
      'IListSavedListQuestionsUseCase',
      {
        useClass: ListSavedListQuestionsUseCase,
      },
    );

    container.register<IGetSavedListIdsForQuestionUseCase>(
      'IGetSavedListIdsForQuestionUseCase',
      {
        useClass: GetSavedListIdsForQuestionUseCase,
      },
    );

    container.register<IDeleteSavedListUseCase>('IDeleteSavedListUseCase', {
      useClass: DeleteSavedListUseCase,
    });

    container.register<IAcceptAnswerUseCase>('IAcceptAnswerUseCase', {
      useClass: AcceptAnswerUseCase,
    });

    container.register<IAiAssistantUseCase>('IAiAssistantUseCase', {
      useClass: AiAssistantUseCase,
    });

    container.register<ICreateAiChatSessionUseCase>(
      'ICreateAiChatSessionUseCase',
      {
        useClass: CreateAiChatSessionUseCase,
      },
    );

    container.register<IListAiChatSessionsUseCase>(
      'IListAiChatSessionsUseCase',
      {
        useClass: ListAiChatSessionsUseCase,
      },
    );

    container.register<IGetAiChatMessagesUseCase>('IGetAiChatMessagesUseCase', {
      useClass: GetAiChatMessagesUseCase,
    });

    container.register<IDeleteQuestionUseCase>('IDeleteQuestionUseCase', {
      useClass: DeleteQuestionUseCase,
    });

    container.register<IDeleteAnswerUseCase>('IDeleteAnswerUseCase', {
      useClass: DeleteAnswerUseCase,
    });

    container.register<IRemoveAcceptedAnswerUseCase>(
      'IRemoveAcceptedAnswerUseCase',
      {
        useClass: RemoveAcceptedAnswerUseCase,
      },
    );

    //---------------------------------Room--------------------------------------//

    container.register<ICreateRoomUseCase>('ICreateRoomUseCase', {
      useClass: CreateRoomUseCase,
    });

    container.register<IJoinRoomUseCase>('IJoinRoomUseCase', {
      useClass: JoinRoomUseCase,
    });

    container.register<IGetPublicRoomsUseCase>('IGetPublicRoomsUseCase', {
      useClass: GetPublicRoomsUseCase,
    });

    container.register<IGetMyRoomsUseCase>('IGetMyRoomsUseCase', {
      useClass: GetMyRoomsUseCase,
    });

    container.register<ISendMessageUseCase>('ISendMessageUseCase', {
      useClass: SendMessageUseCase,
    });

    container.register<IEditMessageUseCase>('IEditMessageUseCase', {
      useClass: EditMessageUseCase,
    });

    container.register<IDeleteMessageUseCase>('IDeleteMessageUseCase', {
      useClass: DeleteMessageUseCase,
    });

    container.register<ILeaveRoomUseCase>('ILeaveRoomUseCase', {
      useClass: LeaveRoomUseCase,
    });

    container.register<ICreateRoomInviteUseCase>('ICreateRoomInviteUseCase', {
      useClass: CreateRoomInviteUseCase,
    });

    container.register<IRegenerateRoomInviteUseCase>('IRegenerateRoomInviteUseCase', {
      useClass: RegenerateRoomInviteUseCase,
    });

    container.register<IRevokeRoomInviteUseCase>('IRevokeRoomInviteUseCase', {
      useClass: RevokeRoomInviteUseCase,
    });

    container.register<IListRoomInvitesUseCase>('IListRoomInvitesUseCase', {
      useClass: ListRoomInvitesUseCase,
    });

    container.register<IPreviewInviteUseCase>('IPreviewInviteUseCase', {
      useClass: PreviewInviteUseCase,
    });

    container.register<IJoinRoomViaInviteUseCase>('IJoinRoomViaInviteUseCase', {
      useClass: JoinRoomViaInviteUseCase,
    });

    container.register<IKickParticipantUseCase>('IKickParticipantUseCase', {
      useClass: KickParticipantUseCase,
    });

    container.register<IGetRoomSettingsUseCase>('IGetRoomSettingsUseCase', {
      useClass: GetRoomSettingsUseCase,
    });

    container.register<IUpdateParticipantOverridesUseCase>(
      'IUpdateParticipantOverridesUseCase',
      {
        useClass: UpdateParticipantOverridesUseCase,
      },
    );

    container.register<IReportParticipantUseCase>('IReportParticipantUseCase', {
      useClass: ReportParticipantUseCase,
    });

    container.register<IEndRoomUseCase>('IEndRoomUseCase', {
      useClass: EndRoomUseCase,
    });

    container.register<ICreatePollUseCase>('ICreatePollUseCase', {
      useClass: CreatePollUseCase,
    });

    container.register<ISubmitPollVoteUseCase>('ISubmitPollVoteUseCase', {
      useClass: SubmitPollVoteUseCase,
    });

    //---------------------------------Realtime--------------------------------------//

    container.register<IAuthenticateRealtimeUserUseCase>(
      'IAuthenticateRealtimeUserUseCase',
      {
        useClass: AuthenticateRealtimeUserUseCase,
      },
    );

    container.register<IAuthorizeCollaborationAccessUseCase>(
      'IAuthorizeCollaborationAccessUseCase',
      {
        useClass: AuthorizeCollaborationAccessUseCase,
      },
    );

    container.register<IAuthorizeCollaborationWriteUseCase>(
      'IAuthorizeCollaborationWriteUseCase',
      {
        useClass: AuthorizeCollaborationWriteUseCase,
      },
    );

    //---------------------------------Session---------------------------------------//

    container.register<IListMentorsUseCase>('IListMentorsUseCase', {
      useClass: ListMentorsUseCase,
    });

    container.register<IGetBookedSessionsUseCase>('IGetBookedSessionsUseCase', {
      useClass: GetBookedSessionsUseCase,
    });

    container.register<IAddReviewUseCase>('IAddReviewUseCase', {
      useClass: AddReviewUseCase,
    });

    container.register<IGetMentorInsightsUseCase>('IGetMentorInsightsUseCase', {
      useClass: GetMentorInsightsUseCase,
    });

    container.register<IGetMentorReviewsUseCase>('IGetMentorReviewsUseCase', {
      useClass: GetMentorReviewsUseCase,
    });

    container.register<ICreateMentorAvailabilityUseCase>(
      'ICreateMentorAvailabilityUseCase',
      {
        useClass: CreateMentorAvailabilityUseCase,
      },
    );

    container.register<IGetAvailableSlotsUseCase>('IGetAvailableSlotsUseCase', {
      useClass: GetAvailableSlotsUseCase,
    });

    container.register<IGetMentorAvailabilityUseCase>(
      'IGetMentorAvailabilityUseCase',
      {
        useClass: GetMentorAvailabilityUseCase,
      },
    );

    container.register<IBookSessionWithStripeUseCase>(
      'IBookSessionWithStripeUseCase',
      {
        useClass: BookSessionWithStripeUseCase,
      },
    );

    container.register<IBookSessionWithWalletUseCase>(
      'IBookSessionWithWalletUseCase',
      {
        useClass: BookSessionWithWalletUseCase,
      },
    );

    container.register<IGetBookingReservationStatusUseCase>(
      'IGetBookingReservationStatusUseCase',
      {
        useClass: GetBookingReservationStatusUseCase,
      },
    );

    container.register<ICancelSessionUseCase>('ICancelSessionUseCase', {
      useClass: CancelSessionUseCase,
    });

    container.register<ICancelBookingReservationUseCase>(
      'ICancelBookingReservationUseCase',
      {
        useClass: CancelBookingReservationUseCase,
      },
    );

    container.register<IDeleteMentorAvailabilityUseCase>(
      'IDeleteMentorAvailabilityUseCase',
      {
        useClass: DeleteMentorAvailabilityUseCase,
      },
    );

    container.register<IAddAvailabilityExceptionUseCase>(
      'IAddAvailabilityExceptionUseCase',
      {
        useClass: AddAvailabilityExceptionUseCase,
      },
    );

    container.register<IViewMentorProfileUseCase>('IViewMentorProfileUseCase', {
      useClass: ViewMentorProfileUseCase,
    });

    container.register<IActivateUpcomingSessionUseCase>(
      'IActivateUpcomingSessionUseCase',
      {
        useClass: ActivateUpcomingSessionUseCase,
      },
    );

    container.register<ITransitionRoomLifecycleUseCase>(
      'ITransitionRoomLifecycleUseCase',
      {
        useClass: TransitionRoomLifecycleUseCase,
      },
    );

    //---------------------------------Payment---------------------------------------//

    container.register<IHandleStripeWebhookUseCase>(
      'IHandleStripeWebhookUseCase',
      {
        useClass: HandleStripeWebhookUseCase,
      },
    );

    //---------------------------------Wallet---------------------------------------//

    container.register<IGetMyWalletUseCase>('IGetMyWalletUseCase', {
      useClass: GetMyWalletUseCase,
    });

    container.register<IGetWalletTransactionsUseCase>(
      'IGetWalletTransactionsUseCase',
      {
        useClass: GetWalletTransactionsUseCase,
      },
    );

    //---------------------------------User---------------------------------------//

    container.register<IUpdateUserProfileUseCase>('IUpdateUserProfileUseCase', {
      useClass: UpdateUserProfileUseCase,
    });

    container.register<IApplyForMentorUseCase>('IApplyForMentorUseCase', {
      useClass: ApplyForMentorUseCase,
    });

    container.register<IGetUserActivityUseCase>('IGetUserActivityUseCase', {
      useClass: GetUserActivityUseCase,
    });

    //---------------------------------Poll---------------------------------------//

    container.register<IGetActivePollUseCase>('IGetActivePollUseCase', {
      useClass: GetActivePollUseCase,
    });

    container.register<IClosePollUseCase>('IClosePollUseCase', {
      useClass: ClosePollUseCase,
    });

    //---------------------------------Notes--------------------------------------//

    container.register<ISavePrivateNoteUseCase>('ISavePrivateNoteUseCase', {
      useClass: SavePrivateNoteUseCase,
    });

    container.register<IGetPrivateNoteUseCase>('IGetPrivateNoteUseCase', {
      useClass: GetPrivateNoteUseCase,
    });

    container.register<IGetPublicNoteUseCase>('IGetPublicNoteUseCase', {
      useClass: GetPublicNoteUseCase,
    });

    container.register<ISavePublicNoteUseCase>('ISavePublicNoteUseCase', {
      useClass: SavePublicNoteUseCase,
    });

    //---------------------------------Plan--------------------------------------//

    container.register<ICreatePlanUseCase>('ICreatePlanUseCase', {
      useClass: CreatePlanUseCase,
    });

    container.register<IUpdatePlanUseCase>('IUpdatePlanUseCase', {
      useClass: UpdatePlanUseCase,
    });

    container.register<IListActivePlansUseCase>('IListActivePlanUseCase', {
      useClass: ListActivePlansUseCase,
    });

    container.register<IGetPlanByIdUseCase>('IGetPlanByIdUseCase', {
      useClass: GetPlanByIdUseCase,
    });

    container.register<IListActivePlansUseCase>('IListActivePlansUseCase', {
      useClass: ListAllPlansUseCase,
    });

    container.register<IGetPlanBySlugUseCase>('IGetPlanBySlugUseCase', {
      useClass: GetPlanBySlugUseCase,
    });

    container.register<IArchivePlanUseCase>('IArchivePlanUseCase', {
      useClass: ArchivePlanUseCase,
    });

    container.register<ISyncPlanStripeCatalogUseCase>(
      'ISyncPlanStripeCatalogUseCase',
      {
        useClass: SyncPlanStripeCatalogUseCase,
      },
    );

    container.register<IResolveUserEntitlementsUseCase>(
      'IResolveUserEntitlementsUseCase',
      {
        useClass: ResolveUserEntitlementsUseCase,
      },
    );

    container.register<ICreateSubscriptionCheckoutSessionUseCase>(
      'ICreateSubscriptionCheckoutSessionUseCase',
      {
        useClass: CreateSubscriptionCheckoutSessionUseCase,
      }
    );

    container.register<IGetActiveSubscriptionUseCase>('IGetActiveSubscriptionUseCase', {
      useClass: GetActiveSubscriptionUseCase,
    });
  }
}
