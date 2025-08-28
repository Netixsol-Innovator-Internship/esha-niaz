"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const notification_schema_1 = require("./schemas/notification.schema");
const user_service_1 = require("../user/user.service");
const mongoose_2 = require("@nestjs/mongoose");
let NotificationService = class NotificationService {
    constructor(notificationModel, userService) {
        this.notificationModel = notificationModel;
        this.userService = userService;
    }
    async createNotification(recipientId, senderId, type, message, commentId, parentCommentId) {
        if (recipientId === senderId) {
            return null;
        }
        const notification = new this.notificationModel({
            recipientId,
            senderId,
            type,
            message,
            commentId,
            parentCommentId,
        });
        await notification.save();
        return notification;
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const notifications = await this.notificationModel
            .find({ recipientId: userId, isActive: true })
            .populate("senderId", "username email profilePicture bio")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.notificationModel.countDocuments({ recipientId: userId, isActive: true });
        const unreadCount = await this.notificationModel.countDocuments({
            recipientId: userId,
            isRead: false,
            isActive: true,
        });
        const notificationResponses = await Promise.all(notifications.map(async (notification) => {
            const recipient = await this.userService.findById(notification.recipientId);
            const sender = await this.userService.findById(notification.senderId);
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
            };
        }));
        return {
            notifications: notificationResponses,
            total,
            unreadCount,
        };
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationModel.findOne({
            _id: notificationId,
            recipientId: userId,
        });
        if (notification) {
            notification.isRead = true;
            await notification.save();
        }
        return notification;
    }
    async markAllAsRead(userId) {
        await this.notificationModel.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
        return {
            message: "All notifications marked as read",
        };
    }
    async deleteNotification(notificationId, userId) {
        const notification = await this.notificationModel.findOne({
            _id: notificationId,
            recipientId: userId,
        });
        if (notification) {
            notification.isActive = false;
            await notification.save();
        }
        return {
            message: "Notification deleted successfully",
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map