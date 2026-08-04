import { IEmailService } from '../../../application/ports/mail/IEmailService';
import { transporter } from '../../../config/nodemaileConfig';


export class MailService implements IEmailService {

    async sendMail(recipient: string, subject: string, html: string): Promise<void> {
        const mailOptions = {
            to: recipient,
            subject: subject,
            html: html
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email. Please try again later.');
        }
    }
}