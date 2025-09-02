import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ enum: ['Start','End','Win','New'] })
  @IsEnum(['Start','End','Win','New'] as any)
  type: 'Start' | 'End' | 'Win' | 'New';

  @ApiPropertyOptional() @IsOptional() @IsMongoId() sender?: string;
  @ApiProperty() @IsMongoId() receiver: string;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() car?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() bid?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() read?: boolean;
}
