import { IsInt, Max, Min, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsMongoId() productId: string;
  @IsInt() @Min(1) @Max(5) stars: number;
  @IsOptional() @IsString() comment?: string;
}
