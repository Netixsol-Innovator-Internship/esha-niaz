import { IsNotEmpty, IsString } from "class-validator"

export class LikeDto {
  @IsNotEmpty()
  @IsString()
  commentId: string
}
