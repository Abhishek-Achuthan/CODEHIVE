export interface IMailservice {
  sendEmail(email: string, message: string): Promise<void>;
}
