import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import  { Model } from "mongoose"
import { Like, LikeDocument } from "./schemas/like.schema"
import  { CommentService } from "../comment/comment.service"
import { UserService } from "../user/user.service"
import  { WebsocketGateway } from "../websocket/websocket.gateway"
import  { NotificationService } from "../notification/notification.service"
import { NotificationType } from "../notification/schemas/notification.schema"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name)   // 👈 REQUIRED
    private likeModel: Model<LikeDocument>,
    private commentService: CommentService,
    private userService: UserService,
    private websocketGateway: WebsocketGateway,
    private notificationService: NotificationService, // Added notification service
  ) {}

  async likeComment(userId: string, commentId: string) {
    // Check if comment exists
    const comment = await this.commentService.getCommentById(commentId)
    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    // Check if already liked
    const existingLike = await this.likeModel.findOne({
      userId,
      commentId,
      isActive: true,
    })

    if (existingLike) {
      throw new ConflictException("You have already liked this comment")
    }

    // Create like
    const like = new this.likeModel({
      userId,
      commentId,
    })

    await like.save()

    // Update comment like count
    await this.commentService.updateLikeCount(commentId, 1)

    // Send real-time notification to comment author (only if different user)
    if (comment.author.id !== userId) {
      const user = await this.userService.findById(userId)

      await this.notificationService.createNotification(
        comment.author.id,
        userId,
        NotificationType.LIKE,
        `${user.username} liked your comment`,
        commentId,
      )

      this.websocketGateway.sendLikeNotification(comment.author.id, {
        type: "like",
        message: `${user.username} liked your comment`,
        commentId,
        userId,
        username: user.username,
        userProfilePicture: user.profilePicture,
      })
    }

    return {
      message: "Comment liked successfully",
      like,
    }
  }


  
  async unlikeComment(userId: string, commentId: string) {
    const like = await this.likeModel.findOne({
      userId,
      commentId,
      isActive: true,
    })

    if (!like) {
      throw new NotFoundException("You have not liked this comment")
    }

    // Remove like (soft delete)
    like.isActive = false
    await like.save()

    // Update comment like count
    await this.commentService.updateLikeCount(commentId, -1)

    return {
      message: "Comment unliked successfully",
    }
  }

  async isLikedByUser(userId: string, commentId: string): Promise<boolean> {
    const like = await this.likeModel.findOne({
      userId,
      commentId,
      isActive: true,
    })
    return !!like
  }

  async getCommentLikes(commentId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const likes = await this.likeModel
      .find({ commentId, isActive: true })
      .populate("userId", "username email profilePicture bio followersCount followingCount")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.likeModel.countDocuments({ commentId, isActive: true })

    return {
      likes: likes.map((like) => ({
        id: like._id.toString(),
        user: like.userId,
        createdAt: like.createdAt,
      })),
      total,
      page,
      limit,
    }
  }

  async getUserLikes(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const likes = await this.likeModel
      .find({ userId, isActive: true })
      .populate("commentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.likeModel.countDocuments({ userId, isActive: true })

    return {
      likes: likes.map((like) => ({
        id: like._id.toString(),
        comment: like.commentId,
        createdAt: like.createdAt,
      })),
      total,
      page,
      limit,
    }
  }

  // Helper method to check multiple comments at once
  async getMultipleLikeStatus(userId: string, commentIds: string[]): Promise<Record<string, boolean>> {
    const likes = await this.likeModel.find({
      userId,
      commentId: { $in: commentIds },
      isActive: true,
    })

    const likeStatus: Record<string, boolean> = {}
    commentIds.forEach((id) => {
      likeStatus[id] = false
    })

    likes.forEach((like) => {
      likeStatus[like.commentId] = true
    })

    return likeStatus
  }
}
