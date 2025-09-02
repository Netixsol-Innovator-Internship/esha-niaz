import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nationality?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() idType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() idNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address1?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address2?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() landline?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() poBox?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trafficInfoType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trafficFileNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plateState?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plateCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plateNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() driverLicenseNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issueCity?: string;
}
