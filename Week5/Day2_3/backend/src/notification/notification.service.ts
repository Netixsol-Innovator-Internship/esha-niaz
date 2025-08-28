import { Injectable } from "@nestjs/common"
import  { Model } from "mongoose"
// import { NotificationDocument, NotificationType } from "./schemas/notification.schema"
import { Notification, NotificationDocument, NotificationType } from "./schemas/notification.schema"
import  { UserService } from "../user/user.service"
import  { NotificationResponseDto } from "./dto/notification-response.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) // 👈 add this
    private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
  ) {}

  async createNotification(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    message: string,
    commentId?: string,
    parentCommentId?: string,
  ) {
    // Don't create notification if sender and recipient are the same
    if (recipientId === senderId) {
      return null
    }

    const notification = new this.notificationModel({
      recipientId,
      senderId,
      type,
      message,
      commentId,
      parentCommentId,
    })

    await notification.save()
    return notification
  }

  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ notifications: NotificationResponseDto[]; total: number; unreadCount: number }> {
    const skip = (page - 1) * limit

    const notifications = await this.notificationModel
      .find({ recipientId: userId, isActive: true })
      .populate("senderId", "username email profilePicture bio")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.notificationModel.countDocuments({ recipientId: userId, isActive: true })
    const unreadCount = await this.notificationModel.countDocuments({
      recipientId: userId,
      isRead: false,
      isActive: true,
    })

    const notificationResponses = await Promise.all(
      notifications.map(async (notification) => {
        const recipient = await this.userService.findById(notification.recipientId)
        const sender = await this.userService.findById(notification.senderId)

        return {
          id: notification._id.toString(),
          recipient,
          sender,
          type: notification.type,
          message: notification.message,
          commentId: notification.commentId,
          parentCommentId: notification.parentCommentId,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        }
      }),
    )

    return {
      notifications: notificationResponses,
      total,
      unreadCount,
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      recipientId: userId,
    })

    if (notification) {
      notification.isRead = true
      await notification.save()
    }

    return notification
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany({ recipientId: userId, isRead: false }, { isRead: true })

    return {
      message: "All notifications marked as read",
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      recipientId: userId,
    })

    if (notification) {
      notification.isActive = false
      await notification.save()
    }

    return {
      message: "Notification deleted successfully",
    }
  }
}


