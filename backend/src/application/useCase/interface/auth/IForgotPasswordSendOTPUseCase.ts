export interface IForgotPasswordSendOTPUseCase {
    execute(email:string) : Promise<void>
}