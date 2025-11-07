import { inject,injectable } from "tsyringe";
import { ISendOTPUseCase } from "../interface/auth/ISendOTPUseCase";
import type { IEmailService } from "../../ports/mail/IEmailService";
import type { IHashService } from "../../ports/security/IHashService";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ConflictError } from "../../../core/errors/ConflictError";
import type { IOTPService } from "../../ports/otp/IOTPService";
import type { IEmailTemplateFactory } from "../../ports/mail/template/IEmailTemplateFactory";
import type { ICacheService } from "../../ports/cache/ICacheService";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";


@injectable() 
export class SendOTPUseCase implements ISendOTPUseCase {

    private readonly _otp_expiry : number

    constructor(
        @inject('IEmailService') private readonly _emailService : IEmailService,
        @inject('IHashService') private readonly _hashService : IHashService,
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
        @inject('IOTPService') private readonly _otpService : IOTPService,
        @inject('IEmailTemplateFactory') private readonly _templateFactory : IEmailTemplateFactory,
        @inject('ICacheService') private readonly _cacheService : ICacheService,
        
    ) { this._otp_expiry = 300};

    async execute(email: string): Promise<void> {
        const existing = await this._userRepository.findByEmail(email);

        if(existing) throw new ConflictError(ERROR_MESSAGES.USER.ALREADY_EXIST);

        const otp = this._otpService.genarateOtp();

        console.log(otp)
        
        const hashedOtp = await this._hashService.hash(otp);

        await this._cacheService.setData(`otp:${email}`,this._otp_expiry,hashedOtp);

        const otpTemplate = this._templateFactory.getOtpMailTemplate();

        const { subject , html } = otpTemplate.render({ otp });

        await this._emailService.sendMail(email,subject,html);
    }
}