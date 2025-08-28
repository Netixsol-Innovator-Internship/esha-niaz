import { IsNotEmpty, IsString } from "class-validator"

export class FollowDto {
  @IsNotEmpty()
  @IsString()
  userId: string
}
