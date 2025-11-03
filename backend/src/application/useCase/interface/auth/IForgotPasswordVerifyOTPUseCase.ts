export interface IForgotPasswordVerifyOTPUseCase {
  execute(otp: string, email: string): Promise<boolean>;
}
