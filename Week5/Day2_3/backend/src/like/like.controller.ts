import { Body, Controller, Post, Delete, Get, Param, Query, UseGuards, BadRequestException } from "@nestjs/common"
import  { LikeService } from "./like.service"
import { LikeDto } from "./dto/like.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { AuthUser } from "../common/interfaces/auth-user.interface"

@Controller("likes")
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private likeService: LikeService) {}

@Post()
async likeComment(@Body() likeDto: LikeDto, @CurrentUser() user: AuthUser) {
  if (!likeDto.commentId) {
    throw new BadRequestException("commentId is required");
  }
  return this.likeService.likeComment(user._id, likeDto.commentId);
}

  @Delete(":commentId")
  async unlikeComment(@Param("commentId") commentId: string, @CurrentUser() user: AuthUser) {
    return this.likeService.unlikeComment(user._id, commentId)
  }

  @Get("comment/:commentId")
  async getCommentLikes(
    @Param("commentId") commentId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)
    return this.likeService.getCommentLikes(commentId, pageNum, limitNum)
  }

  @Get("user/:userId")
  async getUserLikes(
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)
    return this.likeService.getUserLikes(userId, pageNum, limitNum)
  }

  @Get("status/:commentId")
  async getLikeStatus(@Param("commentId") commentId: string, @CurrentUser() user: AuthUser) {
    const isLiked = await this.likeService.isLikedByUser(user._id, commentId)
    return {
      message: "Like status retrieved successfully",
      isLiked,
    }
  }
}
