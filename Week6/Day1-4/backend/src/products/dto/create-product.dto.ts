import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsNumber() @Min(0) price: number;
  @IsEnum(['jeans','shirts','tshirts','hoodies','shorts']) type: string;
  @IsEnum(['male','female']) category: string;
  @IsEnum(['casual','formal','party','gym']) style: string;
  @IsArray() @IsOptional() sizes?: string[];
  @IsNumber() @Min(0) stockQuantity: number;
  @IsOptional() @IsNumber() salePrice?: number;
  @IsOptional() @IsEnum(['cash','points','hybrid']) loyaltyType?: string;
  @IsOptional() @IsNumber() pointsPrice?: number;
}
