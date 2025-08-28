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
exports.FollowerController = void 0;
const common_1 = require("@nestjs/common");
const follower_service_1 = require("./follower.service");
const follow_dto_1 = require("./dto/follow.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FollowerController = class FollowerController {
    constructor(followerService) {
        this.followerService = followerService;
    }
    async followUser(user, followDto) {
        return this.followerService.followUser(user._id, followDto.userId);
    }
    async unfollowUser(user, userId) {
        return this.followerService.unfollowUser(user._id, userId);
    }
    async getFollowers(userId, page = "1", limit = "10") {
        const pageNum = Number.parseInt(page, 10);
        const limitNum = Number.parseInt(limit, 10);
        return this.followerService.getFollowers(userId, pageNum, limitNum);
    }
    async getFollowing(userId, page = "1", limit = "10") {
        const pageNum = Number.parseInt(page, 10);
        const limitNum = Number.parseInt(limit, 10);
        return this.followerService.getFollowing(userId, pageNum, limitNum);
    }
    async isFollowing(user, userId) {
        const isFollowing = await this.followerService.isFollowing(user._id, userId);
        return {
            message: "Follow status retrieved successfully",
            isFollowing,
        };
    }
};
exports.FollowerController = FollowerController;
__decorate([
    (0, common_1.Post)("follow"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, follow_dto_1.FollowDto]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "followUser", null);
__decorate([
    (0, common_1.Delete)("unfollow/:userId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)(":userId/followers"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(":userId/following"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.Get)("is-following/:userId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowerController.prototype, "isFollowing", null);
exports.FollowerController = FollowerController = __decorate([
    (0, common_1.Controller)("followers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [follower_service_1.FollowerService])
], FollowerController);
//# sourceMappingURL=follower.controller.js.map