// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// export class CreateCarDto {
//   @ApiProperty() @IsString() @IsNotEmpty() vin: string;
//   @ApiProperty() @IsNumber() year: number;
//   @ApiProperty() @IsString() make: string;
//   @ApiProperty() @IsString() model: string;
//   @ApiPropertyOptional() @IsOptional() @IsNumber() mileage?: number;
//   @ApiPropertyOptional() @IsOptional() @IsString() engineSize?: string;
//   @ApiPropertyOptional() @IsOptional() @IsString() paint?: string;
//   @ApiPropertyOptional() @IsOptional() @IsBoolean() hasGccSpecs?: boolean;
//   @ApiPropertyOptional() @IsOptional() @IsString() features?: string;
//   @ApiPropertyOptional() @IsOptional() @IsBoolean() accidentHistory?: boolean;
//   @ApiPropertyOptional() @IsOptional() @IsBoolean() fullServiceHistory?: boolean;
//   @ApiPropertyOptional() @IsOptional() @IsEnum(['stock','modified']) modified?: 'stock' | 'modified';
//   @ApiProperty() @IsNumber() @Min(0) maxBid: number;
//     // Filled by backend after uploading to Cloudinary
//   @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() photos?: string[];
//   @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
//   @ApiPropertyOptional() @IsOptional() @IsDateString() startTime?: string;
//   @ApiPropertyOptional() @IsOptional() @IsDateString() endTime?: string;

//   // seller info
//   @ApiPropertyOptional() @IsOptional() @IsEnum(['dealer','private']) sellerType?: 'dealer' | 'private';
//   @ApiPropertyOptional() @IsOptional() @IsString() sellerFirstName?: string;
//   @ApiPropertyOptional() @IsOptional() @IsString() sellerLastName?: string;
//   @ApiPropertyOptional() @IsOptional() @IsString() sellerEmail?: string;
//   @ApiPropertyOptional() @IsOptional() @IsString() sellerPhone?: string;
// }


import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsArray, 
  IsBoolean, 
  IsDateString, 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';

enum ModificationStatus {
  STOCK = 'stock',
  MODIFIED = 'modified',
}

enum SellerType {
  DEALER = 'dealer',
  PRIVATE = 'private',
}

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  make: string;

  @ApiProperty()
  @IsString()
  model: string;

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

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasGccSpecs?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  accidentHistory?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  fullServiceHistory?: boolean;

  @ApiPropertyOptional({ enum: ModificationStatus })
  @IsOptional()
  @IsEnum(ModificationStatus)
  modified?: ModificationStatus;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxBid: number;

  // Filled by backend after uploading to Cloudinary
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

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
