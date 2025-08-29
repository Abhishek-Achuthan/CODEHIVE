import { injectable } from "tsyringe";
import { IGenarateOtp } from "../../services/OTP/IGenarateOTP";
import { IMailservice } from "../../services/IMailservice";
import type { ISendOtpUseCase } from "../../../domain/interfaces/useCases/auth/ISendOtpUseCase";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";

@injectable()
export class SendOTP implements ISendOtpUseCase {
  constructor() {}
  sendOtp(email: string): Promise<void> {}
}
