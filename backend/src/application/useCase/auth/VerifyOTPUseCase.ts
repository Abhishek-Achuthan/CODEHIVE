import { inject, injectable } from "tsyringe";
import { IVerifyOTPUseCase } from "../interface/auth/IVerifyOTPUseCase";
import type { IHashService } from "../../ports/security/IHashService";
import type { ICacheService } from "../../ports/cache/ICacheService";
import { NotFoundError } from "../../../core/Errors/NotFoundError";

@injectable()
export class VerifyOTPUseCase implements IVerifyOTPUseCase {
  constructor(
    @inject("IHashService") private readonly _hashService: IHashService,
    @inject("ICacheService") private readonly _cacheService: ICacheService
  ) {}

  async execute(email: string, otp: string): Promise<boolean> {

    const cacheOtp = await this._cacheService.getData(`otp:${email}`);

    if (!cacheOtp) throw new NotFoundError("OTP not found");

    const verified = await this._hashService.compare(otp, cacheOtp);

    return verified;
  }
}
