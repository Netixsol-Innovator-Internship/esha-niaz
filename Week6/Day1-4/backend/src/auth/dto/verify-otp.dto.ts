import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '../schemas/otp.schema';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'eshaniaz5@gmail.com',
    description: 'The email address the OTP was sent to',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The OTP code received in email',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: OtpPurpose.VerifyEmail,
    description: 'Purpose of the OTP (verify_email or reset_password)',
    enum: OtpPurpose,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
