import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail() email: string;
  @IsString() tokenOrCode: string; // we accept OTP code again for simplicity
  @IsString() @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'Password must contain letters and numbers' })
  newPassword: string;
}
