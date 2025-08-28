import { Controller, Post, Delete, Get, Body, Param, Query, UseGuards } from "@nestjs/common"
import  { FollowerService } from "./follower.service"
import { FollowDto } from "./dto/follow.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { AuthUser } from "../common/interfaces/auth-user.interface"
import { CurrentUser } from "src/common/decorators/current-user.decorator"

@Controller("followers")
@UseGuards(JwtAuthGuard)
export class FollowerController {
  constructor(private followerService: FollowerService) {}

  @Post("follow")
  async followUser(@CurrentUser() user: AuthUser, @Body() followDto: FollowDto) {
    return this.followerService.followUser(user._id, followDto.userId)
  }

  @Delete("unfollow/:userId")
  async unfollowUser(@CurrentUser() user: AuthUser, @Param("userId") userId: string) {
    return this.followerService.unfollowUser(user._id, userId)
  }

  @Get(":userId/followers")
  async getFollowers(
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)
    return this.followerService.getFollowers(userId, pageNum, limitNum)
  }

  @Get(":userId/following")
  async getFollowing(
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)
    return this.followerService.getFollowing(userId, pageNum, limitNum)
  }

  @Get("is-following/:userId")
  async isFollowing(@CurrentUser() user: AuthUser, @Param("userId") userId: string) {
    const isFollowing = await this.followerService.isFollowing(user._id, userId)
    return {
      message: "Follow status retrieved successfully",
      isFollowing,
    }
  }
}
