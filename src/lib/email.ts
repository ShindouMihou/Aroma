import NodeMailer from 'nodemailer';
import configuration from './configuration';

const transporter = NodeMailer.createTransport({
    host: configuration('SMTP_HOST'),
    port: Number.parseInt(configuration('SMTP_PORT') || ''),
    auth: {
        user: configuration('SMTP_USER'),
        pass: configuration('SMTP_PASSWORD')
    }
})

export default class AromaticEmails {
    public static async send(from: string, to: string, subject: string, text: string | undefined, html: string | undefined) {
        return transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        })
    }
}