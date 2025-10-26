export interface ISendOTPUseCase {
  execute(email: string): Promise<void>;
}
