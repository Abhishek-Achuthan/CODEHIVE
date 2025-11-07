import { inject, injectable } from "tsyringe";
import { IForgotPasswordVerifyOTPUseCase } from "../interface/auth/IForgotPasswordVerifyOTPUseCase";
import type { ICacheService } from "../../ports/cache/ICacheService";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import type { IHashService } from "../../ports/security/IHashService";
import { BadRequestError } from "../../../core/errors/BadRequestError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class ForgotPasswordVerifyOTPUseCase
  implements IForgotPasswordVerifyOTPUseCase
{
  constructor(
    @inject("ICacheService") private readonly _cacheService: ICacheService,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IHashService") private readonly _hashService: IHashService
  ) {}
  async execute(otp: string, email: string): Promise<boolean> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

    const cacheOtp = await this._cacheService.getData(
      `forgot_password_otp:${email}`
    );

    if (cacheOtp === null) throw new NotFoundError(ERROR_MESSAGES.OTP.INVALID_OTP);

    const validOtp = await this._hashService.compare(otp, cacheOtp);

    if (!validOtp) throw new BadRequestError(ERROR_MESSAGES.OTP.INVALID_OTP);

    await this._cacheService.deleteData(`forgot_password_otp:${email}`);

    return true;
  }
}
