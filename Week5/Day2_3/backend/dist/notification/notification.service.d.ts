import { Model } from "mongoose";
import { Notification, NotificationDocument, NotificationType } from "./schemas/notification.schema";
import { UserService } from "../user/user.service";
import { NotificationResponseDto } from "./dto/notification-response.dto";
export declare class NotificationService {
    private notificationModel;
    private userService;
    constructor(notificationModel: Model<NotificationDocument>, userService: UserService);
    createNotification(recipientId: string, senderId: string, type: NotificationType, message: string, commentId?: string, parentCommentId?: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & import("./schemas/notification.schema").NotificationTimestamps & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: NotificationResponseDto[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & import("./schemas/notification.schema").NotificationTimestamps & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(notificationId: string, userId: string): Promise<{
        message: string;
    }>;
}
