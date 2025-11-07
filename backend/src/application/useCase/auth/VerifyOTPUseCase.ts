import { inject, injectable } from "tsyringe";
import { IVerifyOTPUseCase } from "../interface/auth/IVerifyOTPUseCase";
import type { IHashService } from "../../ports/security/IHashService";
import type { ICacheService } from "../../ports/cache/ICacheService";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { BadRequestError } from "../../../core/errors/BadRequestError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class VerifyOTPUseCase implements IVerifyOTPUseCase {
  constructor(
    @inject("IHashService") private readonly _hashService: IHashService,
    @inject("ICacheService") private readonly _cacheService: ICacheService
  ) {}

  async execute(email: string, otp: string): Promise<boolean> {

    const cacheOtp = await this._cacheService.getData(`otp:${email}`);

    if (!cacheOtp) throw new NotFoundError(ERROR_MESSAGES.OTP.INVALID_OTP);

    const verified = await this._hashService.compare(otp, cacheOtp);

    if(!verified) throw new BadRequestError(ERROR_MESSAGES.OTP.INVALID_OTP)

    return verified;
  }
}
