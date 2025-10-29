import { container } from "tsyringe";
import { IUserRegisterUseCase } from "../../application/useCase/interface/auth/IUserRegisterUseCase";
import { ISendOTPUseCase } from "../../application/useCase/interface/auth/ISendOTPUseCase";
import { UserRegisterUseCase } from "../../application/useCase/auth/UserRegisterUseCase";
import { SendOTPUseCase } from "../../application/useCase/auth/SendOTPUseCase";
import { IVerifyOTPUseCase } from "../../application/useCase/interface/auth/IVerifyOTPUseCase";
import { VerifyOTPUseCase } from "../../application/useCase/auth/VerifyOTPUseCase";
import { IUserLoginUseCase } from "../../application/useCase/interface/auth/IUserLoginUseCase";
import { UserLoginUseCase } from "../../application/useCase/auth/UserLoginUseCase";

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
  }
}
