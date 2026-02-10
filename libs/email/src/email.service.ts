import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendOtpToMail(email: string, otp: string) {
    return this.mailer.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
    });
  }
}
