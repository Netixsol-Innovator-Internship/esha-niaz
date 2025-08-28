import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator"

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string

  @IsOptional()
  @IsString()
  parentId?: string
}
