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
exports.FollowerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const follower_schema_1 = require("./schemas/follower.schema");
const user_service_1 = require("../user/user.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/schemas/notification.schema");
const mongoose_2 = require("@nestjs/mongoose");
let FollowerService = class FollowerService {
    constructor(followerModel, userService, websocketGateway, notificationService) {
        this.followerModel = followerModel;
        this.userService = userService;
        this.websocketGateway = websocketGateway;
        this.notificationService = notificationService;
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.BadRequestException("You cannot follow yourself");
        }
        const follower = await this.userService.findById(followerId);
        const following = await this.userService.findById(followingId);
        const existingFollow = await this.followerModel.findOne({ followerId, followingId });
        if (existingFollow) {
            if (existingFollow.isActive) {
                throw new common_1.ConflictException("You are already following this user");
            }
            else {
                existingFollow.isActive = true;
                await existingFollow.save();
                await this.userService.updateFollowingCount(followerId, 1);
                await this.userService.updateFollowerCount(followingId, 1);
                await this.notificationService.createNotification(followingId, followerId, notification_schema_1.NotificationType.FOLLOW, `${follower.username} started following you`);
                this.websocketGateway.sendFollowNotification(followingId, {
                    type: "follow",
                    message: `${follower.username} started following you`,
                    userId: followerId,
                    username: follower.username,
                    userProfilePicture: follower.profilePicture,
                });
                return {
                    message: "Successfully followed user",
                    follow: existingFollow,
                };
            }
        }
        const follow = new this.followerModel({ followerId, followingId });
        await follow.save();
        await this.userService.updateFollowingCount(followerId, 1);
        await this.userService.updateFollowerCount(followingId, 1);
        await this.notificationService.createNotification(followingId, followerId, notification_schema_1.NotificationType.FOLLOW, `${follower.username} started following you`);
        this.websocketGateway.sendFollowNotification(followingId, {
            type: "follow",
            message: `${follower.username} started following you`,
            userId: followerId,
            username: follower.username,
            userProfilePicture: follower.profilePicture,
        });
        return {
            message: "Successfully followed user",
            follow,
        };
    }
    async unfollowUser(followerId, followingId) {
        const follow = await this.followerModel.findOne({
            followerId,
            followingId,
            isActive: true,
        });
        if (!follow) {
            throw new common_1.NotFoundException("You are not following this user");
        }
        follow.isActive = false;
        await follow.save();
        await this.userService.updateFollowingCount(followerId, -1);
        await this.userService.updateFollowerCount(followingId, -1);
        return {
            message: "Successfully unfollowed user",
        };
    }
    async getFollowers(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const followers = await this.followerModel
            .find({ followingId: userId, isActive: true })
            .populate("followerId", "username email profilePicture bio followersCount followingCount")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.followerModel.countDocuments({ followingId: userId, isActive: true });
        return {
            followers: followers.map((f) => f.followerId),
            total,
            page,
            limit,
        };
    }
    async getFollowing(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const following = await this.followerModel
            .find({ followerId: userId, isActive: true })
            .populate("followingId", "username email profilePicture bio followersCount followingCount")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.followerModel.countDocuments({ followerId: userId, isActive: true });
        return {
            following: following.map((f) => f.followingId),
            total,
            page,
            limit,
        };
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.followerModel.findOne({
            followerId,
            followingId,
            isActive: true,
        });
        return !!follow;
    }
};
exports.FollowerService = FollowerService;
exports.FollowerService = FollowerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(follower_schema_1.Follower.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService,
        websocket_gateway_1.WebsocketGateway,
        notification_service_1.NotificationService])
], FollowerService);
//# sourceMappingURL=follower.service.js.map