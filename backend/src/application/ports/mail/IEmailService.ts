export interface IEmailService {
  sendMail(recipient: string, subject: string, html: string): Promise<void>;
}
