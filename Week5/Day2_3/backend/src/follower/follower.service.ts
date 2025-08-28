import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common"
import { Model } from "mongoose"
import { Follower, FollowerDocument } from "./schemas/follower.schema"
import { UserService } from "../user/user.service"
import { WebsocketGateway } from "../websocket/websocket.gateway"
import { NotificationService } from "../notification/notification.service"
import { NotificationType } from "../notification/schemas/notification.schema"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class FollowerService {
  // private followerModel: Model<FollowerDocument> // Added @InjectModel decorator
  // private userService: UserService
  // private websocketGateway: WebsocketGateway
  // private notificationService: NotificationService

    constructor(
    @InjectModel(Follower.name) private followerModel: Model<FollowerDocument>, // ✅ FIXED
    private readonly userService: UserService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly notificationService: NotificationService,
  ) {}

  // async followUser(followerId: string, followingId: string) {
  //   if (followerId === followingId) {
  //     throw new BadRequestException("You cannot follow yourself")
  //   }

  //   // Check if users exist
  //   const follower = await this.userService.findById(followerId)
  //   const following = await this.userService.findById(followingId)

  //   // Check if already following
  //   const existingFollow = await this.followerModel.findOne({
  //     followerId,
  //     followingId,
  //     isActive: true,
  //   })

  //   if (existingFollow) {
  //     throw new ConflictException("You are already following this user")
  //   }

  //   // Create follow relationship
  //   const follow = new this.followerModel({
  //     followerId,
  //     followingId,
  //   })

  //   await follow.save()

  //   // Update follower counts
  //   await this.userService.updateFollowingCount(followerId, 1)
  //   await this.userService.updateFollowerCount(followingId, 1)

  //   await this.notificationService.createNotification(
  //     followingId,
  //     followerId,
  //     NotificationType.FOLLOW,
  //     `${follower.username} started following you`,
  //   )

  //   // Send real-time notification
  //   this.websocketGateway.sendFollowNotification(followingId, {
  //     type: "follow",
  //     message: `${follower.username} started following you`,
  //     userId: followerId,
  //     username: follower.username,
  //     userProfilePicture: follower.profilePicture,
  //   })

  //   return {
  //     message: "Successfully followed user",
  //     follow,
  //   }
  // }

  async followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new BadRequestException("You cannot follow yourself")
  }

  // Check if users exist
  const follower = await this.userService.findById(followerId)
  const following = await this.userService.findById(followingId)

  // Check if a follow relationship already exists
  const existingFollow = await this.followerModel.findOne({ followerId, followingId })

  if (existingFollow) {
    if (existingFollow.isActive) {
      throw new ConflictException("You are already following this user")
    } else {
      // Reactivate instead of creating a new record
      existingFollow.isActive = true
      await existingFollow.save()

      await this.userService.updateFollowingCount(followerId, 1)
      await this.userService.updateFollowerCount(followingId, 1)

      await this.notificationService.createNotification(
        followingId,
        followerId,
        NotificationType.FOLLOW,
        `${follower.username} started following you`,
      )

      this.websocketGateway.sendFollowNotification(followingId, {
        type: "follow",
        message: `${follower.username} started following you`,
        userId: followerId,
        username: follower.username,
        userProfilePicture: follower.profilePicture,
      })

      return {
        message: "Successfully followed user",
        follow: existingFollow,
      }
    }
  }

  // If no record exists, create a new follow relationship
  const follow = new this.followerModel({ followerId, followingId })
  await follow.save()

  await this.userService.updateFollowingCount(followerId, 1)
  await this.userService.updateFollowerCount(followingId, 1)

  await this.notificationService.createNotification(
    followingId,
    followerId,
    NotificationType.FOLLOW,
    `${follower.username} started following you`,
  )

  this.websocketGateway.sendFollowNotification(followingId, {
    type: "follow",
    message: `${follower.username} started following you`,
    userId: followerId,
    username: follower.username,
    userProfilePicture: follower.profilePicture,
  })

  return {
    message: "Successfully followed user",
    follow,
  }
}


  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.followerModel.findOne({
      followerId,
      followingId,
      isActive: true,
    })

    if (!follow) {
      throw new NotFoundException("You are not following this user")
    }

    follow.isActive = false
    await follow.save()

    // Update follower counts
    await this.userService.updateFollowingCount(followerId, -1)
    await this.userService.updateFollowerCount(followingId, -1)

    return {
      message: "Successfully unfollowed user",
    }
  }

  async getFollowers(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const followers = await this.followerModel
      .find({ followingId: userId, isActive: true })
      .populate("followerId", "username email profilePicture bio followersCount followingCount")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.followerModel.countDocuments({ followingId: userId, isActive: true })

    return {
      followers: followers.map((f) => f.followerId),
      total,
      page,
      limit,
    }
  }

  async getFollowing(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const following = await this.followerModel
      .find({ followerId: userId, isActive: true })
      .populate("followingId", "username email profilePicture bio followersCount followingCount")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.followerModel.countDocuments({ followerId: userId, isActive: true })

    return {
      following: following.map((f) => f.followingId),
      total,
      page,
      limit,
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followerModel.findOne({
      followerId,
      followingId,
      isActive: true,
    })
    return !!follow
  }
}
