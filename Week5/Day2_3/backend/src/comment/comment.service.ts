import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import  { Comment, CommentDocument } from "./schemas/comment.schema"
import { UserService } from "../user/user.service"
import  { WebsocketGateway } from "../websocket/websocket.gateway"
import  { NotificationService } from "../notification/notification.service"
import { NotificationType } from "../notification/schemas/notification.schema"
import  { CreateCommentDto } from "./dto/create-comment.dto"
import  { UpdateCommentDto } from "./dto/update-comment.dto"
import  { CommentResponseDto } from "./dto/comment-response.dto"

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>, // ✅ Correct
    private userService: UserService,
    private websocketGateway: WebsocketGateway,
    private notificationService: NotificationService,
  ) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    const { content, parentId } = createCommentDto

    // If it's a reply, validate parent comment exists
    let parentComment = null
    if (parentId) {
      parentComment = await this.commentModel.findById(parentId)
      if (!parentComment || !parentComment.isActive) {
        throw new NotFoundException("Parent comment not found")
      }
    }

    // Create the comment
    const comment = new this.commentModel({
      authorId: userId,
      content,
      parentId: parentId || null,
    })

    await comment.save()

    // Get user info for notifications
    const user = await this.userService.findById(userId)

    // If it's a reply, increment parent's reply count
    if (parentComment) {
      parentComment.repliesCount += 1
      await parentComment.save()

      // Send real-time notification to parent comment author (only if different user)
      if (parentComment.authorId !== userId) {
        await this.notificationService.createNotification(
          parentComment.authorId,
          userId,
          NotificationType.REPLY,
          `${user.username} replied to your comment`,
          comment._id.toString(),
          parentId,
        )

        this.websocketGateway.sendNotificationToUser(parentComment.authorId, {
          type: "reply",
          message: `${user.username} replied to your comment`,
          commentId: comment._id.toString(),
          parentCommentId: parentId,
          userId,
          username: user.username,
          userProfilePicture: user.profilePicture,
        })
      }
    } else {
      // Send real-time notification to all users for new top-level comment
      this.websocketGateway.broadcastNewComment({
        type: "new_comment",
        message: `${user.username} posted a new comment`,
        commentId: comment._id.toString(),
        userId,
        username: user.username,
        userProfilePicture: user.profilePicture,
        content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      })
    }

    return this.getCommentById(comment._id.toString(), userId)
  }

  async getComments(page = 1, limit = 10, userId?: string): Promise<{ comments: CommentResponseDto[]; total: number }> {
    const skip = (page - 1) * limit

    // Get top-level comments only
    const comments = await this.commentModel
      .find({ parentId: null, isActive: true })
      .populate("authorId", "username email profilePicture bio followersCount followingCount")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.commentModel.countDocuments({ parentId: null, isActive: true })

    const commentResponses = await Promise.all(
      comments.map(async (comment) => {
        const commentResponse = await this.transformCommentResponse(comment, userId)
        // Get first few replies for each comment
        commentResponse.replies = await this.getReplies(comment._id.toString(), 1, 3, userId)
        return commentResponse
      }),
    )

    return {
      comments: commentResponses,
      total,
    }
  }

  async getReplies(parentId: string, page = 1, limit = 5, userId?: string): Promise<CommentResponseDto[]> {
    const skip = (page - 1) * limit

    const replies = await this.commentModel
      .find({ parentId, isActive: true })
      .populate("authorId", "username email profilePicture bio followersCount followingCount")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 }) // Oldest first for replies

    return Promise.all(replies.map((reply) => this.transformCommentResponse(reply, userId)))
  }

  async getCommentById(commentId: string, userId?: string): Promise<CommentResponseDto> {
    const comment = await this.commentModel
      .findById(commentId)
      .populate("authorId", "username email profilePicture bio followersCount followingCount")

    if (!comment || !comment.isActive) {
      throw new NotFoundException("Comment not found")
    }

    return this.transformCommentResponse(comment, userId)
  }

  async updateComment(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentModel.findById(commentId)

    if (!comment || !comment.isActive) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.authorId.toString() !== userId.toString()) {
      throw new ForbiddenException("You can only edit your own comments")
    }

    comment.content = updateCommentDto.content
    comment.isEdited = true
    comment.editedAt = new Date()
    await comment.save()

    return this.getCommentById(commentId, userId)
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId)

    if (!comment || !comment.isActive) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.authorId.toString() !== userId.toString()) {
      throw new ForbiddenException("You can only delete your own comments")
    }

    // Soft delete
    comment.isActive = false
    await comment.save()

    // If it's a reply, decrement parent's reply count
    if (comment.parentId) {
      await this.commentModel.findByIdAndUpdate(comment.parentId, {
        $inc: { repliesCount: -1 },
      })
    }

    // Also soft delete all replies to this comment
    await this.commentModel.updateMany({ parentId: commentId }, { isActive: false })
  }

  async updateLikeCount(commentId: string, increment: number): Promise<void> {
    await this.commentModel.findByIdAndUpdate(commentId, {
      $inc: { likesCount: increment },
    })
  }

  private async transformCommentResponse(comment: CommentDocument, userId?: string): Promise<CommentResponseDto> {
    const author = await this.userService.findById(comment.authorId)

    return {
      id: comment._id.toString(),
      content: comment.content,
      author,
      parentId: comment.parentId,
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      isEdited: comment.isEdited,
      editedAt: comment.editedAt,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      // isLikedByUser will be set by like service if userId is provided
    }
  }
}
