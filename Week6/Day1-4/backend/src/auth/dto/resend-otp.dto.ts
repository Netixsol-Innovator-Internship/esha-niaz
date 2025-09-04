import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OtpPurpose } from '../schemas/otp.schema';

export class ResendOtpDto {
  @IsEmail() email: string;
  @IsEnum(OtpPurpose) purpose: OtpPurpose;
}
