import { createTransport } from 'nodemailer';
import { env } from './envConfig';

export const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass
    }
});