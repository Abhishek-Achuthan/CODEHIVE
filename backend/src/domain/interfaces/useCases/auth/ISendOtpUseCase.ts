export interface ISendOtpUseCase {
    sendOtp(email:string):Promise<void>
}