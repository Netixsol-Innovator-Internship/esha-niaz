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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const like_schema_1 = require("./schemas/like.schema");
const comment_service_1 = require("../comment/comment.service");
const user_service_1 = require("../user/user.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/schemas/notification.schema");
const mongoose_2 = require("@nestjs/mongoose");
let LikeService = class LikeService {
    constructor(likeModel, commentService, userService, websocketGateway, notificationService) {
        this.likeModel = likeModel;
        this.commentService = commentService;
        this.userService = userService;
        this.websocketGateway = websocketGateway;
        this.notificationService = notificationService;
    }
    async likeComment(userId, commentId) {
        const comment = await this.commentService.getCommentById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        const existingLike = await this.likeModel.findOne({
            userId,
            commentId,
            isActive: true,
        });
        if (existingLike) {
            throw new common_1.ConflictException("You have already liked this comment");
        }
        const like = new this.likeModel({
            userId,
            commentId,
        });
        await like.save();
        await this.commentService.updateLikeCount(commentId, 1);
        if (comment.author.id !== userId) {
            const user = await this.userService.findById(userId);
            await this.notificationService.createNotification(comment.author.id, userId, notification_schema_1.NotificationType.LIKE, `${user.username} liked your comment`, commentId);
            this.websocketGateway.sendLikeNotification(comment.author.id, {
                type: "like",
                message: `${user.username} liked your comment`,
                commentId,
                userId,
                username: user.username,
                userProfilePicture: user.profilePicture,
            });
        }
        return {
            message: "Comment liked successfully",
            like,
        };
    }
    async unlikeComment(userId, commentId) {
        const like = await this.likeModel.findOne({
            userId,
            commentId,
            isActive: true,
        });
        if (!like) {
            throw new common_1.NotFoundException("You have not liked this comment");
        }
        like.isActive = false;
        await like.save();
        await this.commentService.updateLikeCount(commentId, -1);
        return {
            message: "Comment unliked successfully",
        };
    }
    async isLikedByUser(userId, commentId) {
        const like = await this.likeModel.findOne({
            userId,
            commentId,
            isActive: true,
        });
        return !!like;
    }
    async getCommentLikes(commentId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const likes = await this.likeModel
            .find({ commentId, isActive: true })
            .populate("userId", "username email profilePicture bio followersCount followingCount")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.likeModel.countDocuments({ commentId, isActive: true });
        return {
            likes: likes.map((like) => ({
                id: like._id.toString(),
                user: like.userId,
                createdAt: like.createdAt,
            })),
            total,
            page,
            limit,
        };
    }
    async getUserLikes(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const likes = await this.likeModel
            .find({ userId, isActive: true })
            .populate("commentId")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.likeModel.countDocuments({ userId, isActive: true });
        return {
            likes: likes.map((like) => ({
                id: like._id.toString(),
                comment: like.commentId,
                createdAt: like.createdAt,
            })),
            total,
            page,
            limit,
        };
    }
    async getMultipleLikeStatus(userId, commentIds) {
        const likes = await this.likeModel.find({
            userId,
            commentId: { $in: commentIds },
            isActive: true,
        });
        const likeStatus = {};
        commentIds.forEach((id) => {
            likeStatus[id] = false;
        });
        likes.forEach((like) => {
            likeStatus[like.commentId] = true;
        });
        return likeStatus;
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(like_schema_1.Like.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        comment_service_1.CommentService,
        user_service_1.UserService,
        websocket_gateway_1.WebsocketGateway,
        notification_service_1.NotificationService])
], LikeService);
//# sourceMappingURL=like.service.js.map