import { container } from "tsyringe";
import { IUserRegisterUseCase } from "../../application/useCase/interface/auth/IUserRegisterUseCase";
import { ISendOTPUseCase } from "../../application/useCase/interface/auth/ISendOTPUseCase";
import { UserRegisterUseCase } from "../../application/useCase/auth/UserRegisterUseCase";
import { SendOTPUseCase } from "../../application/useCase/auth/SendOTPUseCase";


export class UseCaseModule {
    static registerModules ():void {
        container.register<IUserRegisterUseCase>('IUserRegisterUseCase',{
            useClass: UserRegisterUseCase
        });

        container.register<ISendOTPUseCase>('ISendOTPUseCase',{
            useClass: SendOTPUseCase
        });
    }
}