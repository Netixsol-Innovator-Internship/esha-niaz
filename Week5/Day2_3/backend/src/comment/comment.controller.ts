import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import  { CommentService } from "./comment.service"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { AuthUser } from "../common/interfaces/auth-user.interface"

@Controller("comments")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: AuthUser) {
    return {
      message: "Comment created successfully",
      comment: await this.commentService.createComment(user._id, createCommentDto),
    }
  }

  @Get()
  async getComments(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("userId") userId?: string,
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)

    const result = await this.commentService.getComments(pageNum, limitNum, userId)
    return {
      message: "Comments retrieved successfully",
      ...result,
      page: pageNum,
      limit: limitNum,
    }
  }

  @Get(":id")
  async getCommentById(@Param("id") id: string, @Query("userId") userId?: string) {
    return {
      message: "Comment retrieved successfully",
      comment: await this.commentService.getCommentById(id, userId),
    }
  }

  @Get(":id/replies")
  async getReplies(
    @Param("id") parentId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
    @Query("userId") userId?: string,
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)

    return {
      message: "Replies retrieved successfully",
      replies: await this.commentService.getReplies(parentId, pageNum, limitNum, userId),
      page: pageNum,
      limit: limitNum,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  
  async updateComment(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return {
      message: "Comment updated successfully",
      comment: await this.commentService.updateComment(id, user._id, updateCommentDto),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteComment(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    await this.commentService.deleteComment(id, user._id)
    return {
      message: "Comment deleted successfully",
    }
  }
}
