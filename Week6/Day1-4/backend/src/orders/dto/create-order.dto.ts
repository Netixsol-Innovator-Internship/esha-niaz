import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// class ItemDto {
//   // @IsNotEmpty() productId: string;
//   // @IsNumber() quantity: number;
//   // @IsOptional() selectedSize?: string;
//   // @IsOptional() selectedColor?: string;
// }

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsEnum(['cod','card','points','hybrid']) paymentMethod: 'cod' | 'card' | 'points' | 'hybrid';

  @IsObject() address: any;
  @IsOptional() paymentInfo?: any;
}
