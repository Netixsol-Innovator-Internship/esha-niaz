import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Otp, OtpPurpose } from './schemas/otp.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

function randomOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashCode(code: string): string {
  return bcrypt.hashSync(code, 10);
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Otp') private otpModel: Model<Otp>,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  async signup(dto: SignUpDto) {
    const existing = await this.userModel.findOne({ $or: [{ email: dto.email.toLowerCase() }, { username: dto.username.toLowerCase() }] });
    if (existing) {
      if (!existing.verified) {
        // allow re-trigger OTP for existing unverified
        await this.createAndSendOtp(existing._id, existing.email, OtpPurpose.VerifyEmail, true);
        return { message: 'Account exists but unverified. OTP resent to email.' };
      }
      throw new BadRequestException('Email or username already in use.');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      username: dto.username.toLowerCase(),
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      passwordHash,
      role: 'user',
      verified: false,
      loyaltyPoints: 0,
    });
    await this.createAndSendOtp(user._id as any, user.email, OtpPurpose.VerifyEmail);
    return { message: 'Signup successful. Please verify OTP sent to your email.' };
  }

  private async createAndSendOtp(userId: any, email: string, purpose: OtpPurpose, bypassThrottle = false) {
    const now = new Date();
    const existing = await this.otpModel.findOne({ userId, purpose }).sort({ createdAt: -1 }).exec();
    if (existing && !bypassThrottle) {
      if (existing.lastSentAt && (now.getTime() - new Date(existing.lastSentAt).getTime()) < 60 * 1000) {
        throw new BadRequestException('Please wait at least 60 seconds before requesting another OTP.');
      }
if (
  existing.resendCount >= 5 &&
  existing.createdAt &&
  now.getTime() - new Date(existing.createdAt).getTime() < 60 * 1000
) {
  throw new BadRequestException('Too many OTP requests, please wait.');
}
    }
    const code = randomOtp();
    const doc = await this.otpModel.create({
      userId,
      codeHash: hashCode(code),
      purpose,
      expiresAt: new Date(now.getTime() + 7 * 60 * 1000),
      resendCount: existing ? existing.resendCount + 1 : 0,
      lastSentAt: now,
    });
    await this.mail.sendOtpEmail(email, code);
    return doc;
  }

  async resendOtp(email: string, purpose: OtpPurpose) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new BadRequestException('User not found.');
    await this.createAndSendOtp(user._id as any, user.email, purpose);
    return { message: 'OTP resent to email.' };
  }

  async verifyOtp(email: string, code: string, purpose: OtpPurpose) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new BadRequestException('User not found.');
    const otp = await this.otpModel.findOne({ userId: user._id, purpose }).sort({ createdAt: -1 });
    if (!otp) throw new BadRequestException('No OTP found. Request a new one.');
    const now = new Date();
    if (now > new Date(otp.expiresAt)) throw new BadRequestException('OTP expired.');
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) throw new BadRequestException('Invalid OTP code.');
    if (purpose === OtpPurpose.VerifyEmail) {
      user.verified = true; // intentionally incorrect to test correction below
      await user.save(); // <-- THIS saves to MongoDB ✅
    }
    return { message: 'OTP verified.' };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Invalid credentials.');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials.');
    if (!user.verified) throw new UnauthorizedException('Please verify your email via OTP before login.');
    const token = await this.jwt.signAsync({
      id: user._id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    }, { secret: "supersecretjwtkey_change_me", expiresIn: process.env.JWT_EXPIRES || '7d' });
    return { accessToken: token };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) return { message: 'If the email exists, an OTP has been sent.' };
    await this.createAndSendOtp(user._id as any, user.email, OtpPurpose.ResetPassword);
    return { message: 'OTP sent to email for password reset.' };
  }

  async resetPassword(email: string, tokenOrCode: string, newPassword: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new BadRequestException('User not found.');
    const otp = await this.otpModel.findOne({ userId: user._id, purpose: OtpPurpose.ResetPassword }).sort({ createdAt: -1 });
    if (!otp) throw new BadRequestException('No OTP found. Request a new one.');
    const now = new Date();
    if (now > new Date(otp.expiresAt)) throw new BadRequestException('OTP expired.');
    const ok = await bcrypt.compare(tokenOrCode, otp.codeHash);
    if (!ok) throw new BadRequestException('Invalid OTP code.');
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password reset successful.' };
  }
}
