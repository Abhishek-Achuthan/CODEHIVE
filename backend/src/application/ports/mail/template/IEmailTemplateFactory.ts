import { IEmailTemplate } from './IEmailTemplate';

export interface IEmailTemplateFactory {
  getOtpMailTemplate(): IEmailTemplate<{ otp: string }>;
}
