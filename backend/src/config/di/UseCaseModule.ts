import { container } from "tsyringe";
import { IUserRegisterUseCase } from "../../application/useCase/interface/auth/IUserRegisterUseCase";
import { ISendOTPUseCase } from "../../application/useCase/interface/auth/ISendOTPUseCase";
import { UserRegisterUseCase } from "../../application/useCase/auth/UserRegisterUseCase";
import { SendOTPUseCase } from "../../application/useCase/auth/SendOTPUseCase";
import { IVerifyOTPUseCase } from "../../application/useCase/interface/auth/IVerifyOTPUseCase";
import { VerifyOTPUseCase } from "../../application/useCase/auth/VerifyOTPUseCase";
import { IUserLoginUseCase } from "../../application/useCase/interface/auth/IUserLoginUseCase";
import { UserLoginUseCase } from "../../application/useCase/auth/UserLoginUseCase";
import { IForgotPasswordSendOTPUseCase } from "../../application/useCase/interface/auth/IForgotPasswordSendOTPUseCase";
import { ForgotPasswordSendOTPUseCase } from "../../application/useCase/auth/ForgotPasswordSendOTPUseCase";
import { IForgotPasswordVerifyOTPUseCase } from "../../application/useCase/interface/auth/IForgotPasswordVerifyOTPUseCase";
import { ForgotPasswordVerifyOTPUseCase } from "../../application/useCase/auth/ForgotPasswordVerifyOTPUseCase";
import { IResetPasswordUseCase } from "../../application/useCase/interface/auth/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/useCase/auth/ResetPasswordUseCase";
import { IListUsersUseCase } from "../../application/useCase/interface/admin/IListUsersUseCase";
import { ListUsersUseCase } from "../../application/useCase/admin/ListUsersUseCase";
import { IUpdateUserStatusUseCase } from "../../application/useCase/interface/admin/IUpdateUserStatusUseCase";
import { UpdateUserStatusUseCase } from "../../application/useCase/admin/UpdateUserStatusUseCase";
import { IUserLogoutUseCase } from "../../application/useCase/interface/auth/IUserLogoutUseCase";
import { UserLogoutUseCase } from "../../application/useCase/auth/UserLogoutUseCase";
import { IRefreshAccessTokenUseCase } from "../../application/useCase/interface/auth/IRefreshAccessTokenUseCase";
import { RefreshAccessTokenUseCase } from "../../application/useCase/auth/RefreshAccessTokenUseCase";


export class UseCaseModule {
  static registerModules(): void {
    container.register<IUserRegisterUseCase>("IUserRegisterUseCase", {
      useClass: UserRegisterUseCase,
    });

    container.register<ISendOTPUseCase>("ISendOTPUseCase", {
      useClass: SendOTPUseCase,
    });

    container.register<IVerifyOTPUseCase>("IVerifyOTPUseCase", {
      useClass: VerifyOTPUseCase,
    });

    container.register<IUserLoginUseCase>("IUserLoginUseCase", {
      useClass: UserLoginUseCase,
    });

    container.register<IForgotPasswordSendOTPUseCase>('IForgotPasswordSendOTPUseCase',{
      useClass: ForgotPasswordSendOTPUseCase,
    });

    container.register<IForgotPasswordVerifyOTPUseCase>('IForgotPasswordVerifyOTPUseCase', {
      useClass: ForgotPasswordVerifyOTPUseCase,
    });

    container.register<IResetPasswordUseCase>('IResetPasswordUseCase', {
      useClass: ResetPasswordUseCase,
    });

    container.register<IListUsersUseCase>('IListUsersUseCase', {
      useClass: ListUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>('IUpdateUserStatusUseCase' ,{
      useClass : UpdateUserStatusUseCase,
    });

    container.register<IUserLogoutUseCase>('IUserLogoutUseCase', {
      useClass: UserLogoutUseCase
    })

    container.register<IRefreshAccessTokenUseCase>('IRefreshAccessTokenUseCase', {
      useClass: RefreshAccessTokenUseCase
    })

  }
}
