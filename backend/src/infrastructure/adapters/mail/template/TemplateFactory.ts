import { IEmailTemplate } from '../../../../application/ports/mail/template/IEmailTemplate';
import { IEmailTemplateFactory } from '../../../../application/ports/mail/template/IEmailTemplateFactory';
import { OTPMailTemplate } from './otpMailTemplate';

export class TemplateFactoryImpl implements IEmailTemplateFactory {
  getOtpMailTemplate(): IEmailTemplate<{ otp: string }> {
    return new OTPMailTemplate()
  }
}

