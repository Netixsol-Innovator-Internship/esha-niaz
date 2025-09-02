// import { PartialType } from '@nestjs/swagger';
// import { CreateCarDto } from './create-car.dto';

// export class UpdateCarDto extends PartialType(CreateCarDto) {}




import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum ModificationStatus {
  STOCK = 'stock',
  MODIFIED = 'modified',
}

enum SellerType {
  DEALER = 'dealer',
  PRIVATE = 'private',
}

export class UpdateCarDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carModel?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  engineSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasGccSpecs?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  accidentHistory?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  fullServiceHistory?: boolean;

  @ApiPropertyOptional({ enum: ModificationStatus })
  @IsOptional()
  @IsEnum(ModificationStatus)
  modified?: ModificationStatus;

//   @ApiPropertyOptional({ type: [String] })
//   @IsOptional()
//   @IsArray()
//   photos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  // seller info
  @ApiPropertyOptional({ enum: SellerType })
  @IsOptional()
  @IsEnum(SellerType)
  sellerType?: SellerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sellerFirstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sellerLastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sellerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sellerPhone?: string;
}









