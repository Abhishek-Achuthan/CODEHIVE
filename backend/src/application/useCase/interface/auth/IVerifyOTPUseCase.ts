export interface IVerifyOTPUseCase {
  execute(email: string, otp: string): Promise<boolean>;
}
