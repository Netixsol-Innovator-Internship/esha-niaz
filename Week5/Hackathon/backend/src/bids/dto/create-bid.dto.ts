import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @ApiProperty() @IsMongoId() @IsNotEmpty() carId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
}
