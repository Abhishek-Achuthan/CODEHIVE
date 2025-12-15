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

    container.register<IListAnswerUseCase>('IListAnswerUseCase',{
      useClass: ListAnswerUseCase,
    });

    container.register<IGetQuestionUseCase>('IGetQuestionUseCase', {
      useClass: GetQuestionUseCase,
    });

    container.register<IRelatedQuestionUseCase>('IRelatedQuestionUseCase', {
      useClass: RelatedQuestionUseCase,
    });

    container.register<IToggleSaveQuestionUseCase>('IToggleSaveQuestionUseCase',{
      useClass: ToggleSaveQuestionUseCase,
    });

    container.register<IEditQuestionUseCase>('IEditQuestionUseCase', {
      useClass:EditQuestionUseCase,
    });

    container.register<IEditAnswerUseCase>('IEditAnswerUseCase',{
      useClass: EditAnswerUseCase,
    });

    container.register<IGetAnswerUseCase>('IGetAnswerUseCase',{
      useClass:GetAnswerUseCase,
    });

  }
}
