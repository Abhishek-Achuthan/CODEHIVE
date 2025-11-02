import { inject,injectable  } from "tsyringe";
import { IForgotPasswordSendOTPUseCase } from "../interface/auth/IForgotPasswordSendOTPUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import type { IEmailService } from "../../ports/mail/IEmailService";
import type { IEmailTemplateFactory } from "../../ports/mail/template/IEmailTemplateFactory";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import type { IOTPService } from "../../ports/otp/IOTPService";
import type { ICacheService } from "../../ports/cache/ICacheService";
import type { IHashService } from "../../ports/security/IHashService";
import { TooManyRequestError } from "../../../core/errors/TooManyRequestError";


@injectable()
export class ForgotPasswordSendOTPUseCase implements IForgotPasswordSendOTPUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userReposiotry : IUserRepository,
        @inject('IOTPService') private readonly _otpService : IOTPService,
        @inject('IEmailService') private readonly _emailService : IEmailService,
        @inject('IEmailTemplateFactory') private readonly _templateFactory : IEmailTemplateFactory,
        @inject('ICacheService') private readonly _cacheService : ICacheService,
        @inject('IHashService') private readonly _hashService : IHashService,
    ){}

    async execute(email: string): Promise<void> {
        
        const validUser = await this._userReposiotry.findByEmail(email);

        if(!validUser) throw new NotFoundError('User not found');

        const existingOtp = await this._cacheService.getData(`forgot_password_otp:${email}`);

        if(existingOtp) throw new TooManyRequestError('OTP already sent. please wait before requesting another one');

        const otp = this._otpService.genarateOtp();
 
        const hashedOtp = await this._hashService.hash(otp);

        const otpTemplate  = this._templateFactory.getOtpMailTemplate();

        const { subject, html } = otpTemplate.render({otp});

        await this._cacheService.setData(`forgot_password_otp:${email}`,300,hashedOtp);

        await this._emailService.sendMail(email,subject,html);
    }

}

