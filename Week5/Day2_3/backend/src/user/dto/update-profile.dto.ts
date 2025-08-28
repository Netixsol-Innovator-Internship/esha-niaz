import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string

  @IsOptional()
  @IsString()
  profilePicture?: string
}
