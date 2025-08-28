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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const user_service_1 = require("../user/user.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/schemas/notification.schema");
let CommentService = class CommentService {
    constructor(commentModel, userService, websocketGateway, notificationService) {
        this.commentModel = commentModel;
        this.userService = userService;
        this.websocketGateway = websocketGateway;
        this.notificationService = notificationService;
    }
    async createComment(userId, createCommentDto) {
        const { content, parentId } = createCommentDto;
        let parentComment = null;
        if (parentId) {
            parentComment = await this.commentModel.findById(parentId);
            if (!parentComment || !parentComment.isActive) {
                throw new common_1.NotFoundException("Parent comment not found");
            }
        }
        const comment = new this.commentModel({
            authorId: userId,
            content,
            parentId: parentId || null,
        });
        await comment.save();
        const user = await this.userService.findById(userId);
        if (parentComment) {
            parentComment.repliesCount += 1;
            await parentComment.save();
            if (parentComment.authorId !== userId) {
                await this.notificationService.createNotification(parentComment.authorId, userId, notification_schema_1.NotificationType.REPLY, `${user.username} replied to your comment`, comment._id.toString(), parentId);
                this.websocketGateway.sendNotificationToUser(parentComment.authorId, {
                    type: "reply",
                    message: `${user.username} replied to your comment`,
                    commentId: comment._id.toString(),
                    parentCommentId: parentId,
                    userId,
                    username: user.username,
                    userProfilePicture: user.profilePicture,
                });
            }
        }
        else {
            this.websocketGateway.broadcastNewComment({
                type: "new_comment",
                message: `${user.username} posted a new comment`,
                commentId: comment._id.toString(),
                userId,
                username: user.username,
                userProfilePicture: user.profilePicture,
                content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            });
        }
        return this.getCommentById(comment._id.toString(), userId);
    }
    async getComments(page = 1, limit = 10, userId) {
        const skip = (page - 1) * limit;
        const comments = await this.commentModel
            .find({ parentId: null, isActive: true })
            .populate("authorId", "username email profilePicture bio followersCount followingCount")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.commentModel.countDocuments({ parentId: null, isActive: true });
        const commentResponses = await Promise.all(comments.map(async (comment) => {
            const commentResponse = await this.transformCommentResponse(comment, userId);
            commentResponse.replies = await this.getReplies(comment._id.toString(), 1, 3, userId);
            return commentResponse;
        }));
        return {
            comments: commentResponses,
            total,
        };
    }
    async getReplies(parentId, page = 1, limit = 5, userId) {
        const skip = (page - 1) * limit;
        const replies = await this.commentModel
            .find({ parentId, isActive: true })
            .populate("authorId", "username email profilePicture bio followersCount followingCount")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 1 });
        return Promise.all(replies.map((reply) => this.transformCommentResponse(reply, userId)));
    }
    async getCommentById(commentId, userId) {
        const comment = await this.commentModel
            .findById(commentId)
            .populate("authorId", "username email profilePicture bio followersCount followingCount");
        if (!comment || !comment.isActive) {
            throw new common_1.NotFoundException("Comment not found");
        }
        return this.transformCommentResponse(comment, userId);
    }
    async updateComment(commentId, userId, updateCommentDto) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment || !comment.isActive) {
            throw new common_1.NotFoundException("Comment not found");
        }
        if (comment.authorId.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException("You can only edit your own comments");
        }
        comment.content = updateCommentDto.content;
        comment.isEdited = true;
        comment.editedAt = new Date();
        await comment.save();
        return this.getCommentById(commentId, userId);
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment || !comment.isActive) {
            throw new common_1.NotFoundException("Comment not found");
        }
        if (comment.authorId.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException("You can only delete your own comments");
        }
        comment.isActive = false;
        await comment.save();
        if (comment.parentId) {
            await this.commentModel.findByIdAndUpdate(comment.parentId, {
                $inc: { repliesCount: -1 },
            });
        }
        await this.commentModel.updateMany({ parentId: commentId }, { isActive: false });
    }
    async updateLikeCount(commentId, increment) {
        await this.commentModel.findByIdAndUpdate(commentId, {
            $inc: { likesCount: increment },
        });
    }
    async transformCommentResponse(comment, userId) {
        const author = await this.userService.findById(comment.authorId);
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
        };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService,
        websocket_gateway_1.WebsocketGateway,
        notification_service_1.NotificationService])
], CommentService);
//# sourceMappingURL=comment.service.js.map