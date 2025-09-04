import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  async sendOtpEmail(to: string, code: string) {
    const from = process.env.MAIL_FROM || 'no-reply@example.com';
    const info = await this.transporter.sendMail({
      from,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP is ${code}. It will expire in 7 minutes.`,
      html: `<p>Your OTP is <b>${code}</b>. It will expire in <b>7 minutes</b>.</p>`,
    });
    this.logger.log(`OTP email sent to ${to}: ${info.messageId}`);
  }
}
