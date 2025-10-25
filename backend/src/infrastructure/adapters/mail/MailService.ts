import { IEmailService } from "../../../application/ports/mail/IEmailService";
import { transporter } from "../../../config/nodeMailerConfig";


export class MailService implements IEmailService {

    async sendMail(recipient: string, subject: string, html: string): Promise<void> {
        const mailOptions = {
            to:recipient,
            subject:subject,
            html: html
        }
        transporter.sendMail(mailOptions);
    }
}