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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const like_dto_1 = require("./dto/like.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let LikeController = class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    async likeComment(likeDto, user) {
        if (!likeDto.commentId) {
            throw new common_1.BadRequestException("commentId is required");
        }
        return this.likeService.likeComment(user._id, likeDto.commentId);
    }
    async unlikeComment(commentId, user) {
        return this.likeService.unlikeComment(user._id, commentId);
    }
    async getCommentLikes(commentId, page = "1", limit = "10") {
        const pageNum = Number.parseInt(page, 10);
        const limitNum = Number.parseInt(limit, 10);
        return this.likeService.getCommentLikes(commentId, pageNum, limitNum);
    }
    async getUserLikes(userId, page = "1", limit = "10") {
        const pageNum = Number.parseInt(page, 10);
        const limitNum = Number.parseInt(limit, 10);
        return this.likeService.getUserLikes(userId, pageNum, limitNum);
    }
    async getLikeStatus(commentId, user) {
        const isLiked = await this.likeService.isLikedByUser(user._id, commentId);
        return {
            message: "Like status retrieved successfully",
            isLiked,
        };
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [like_dto_1.LikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeComment", null);
__decorate([
    (0, common_1.Delete)(":commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "unlikeComment", null);
__decorate([
    (0, common_1.Get)("comment/:commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getCommentLikes", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getUserLikes", null);
__decorate([
    (0, common_1.Get)("status/:commentId"),
    __param(0, (0, common_1.Param)("commentId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getLikeStatus", null);
exports.LikeController = LikeController = __decorate([
    (0, common_1.Controller)("likes"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map