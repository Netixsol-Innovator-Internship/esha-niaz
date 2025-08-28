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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        const user = await this.userModel.findById(id).select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return this.transformUserResponse(user);
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).select("-password");
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return this.transformUserResponse(user);
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (updateProfileDto.bio !== undefined) {
            user.bio = updateProfileDto.bio;
        }
        if (updateProfileDto.profilePicture !== undefined) {
            user.profilePicture = updateProfileDto.profilePicture;
        }
        await user.save();
        return this.transformUserResponse(user);
    }
    async uploadProfilePicture(userId, filename) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        user.profilePicture = `/uploads/profiles/${filename}`;
        await user.save();
        return this.transformUserResponse(user);
    }
    async searchUsers(query, limit = 10) {
        const users = await this.userModel
            .find({
            $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
            isActive: true,
        })
            .select("-password")
            .limit(limit);
        return users.map((user) => this.transformUserResponse(user));
    }
    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const users = await this.userModel
            .find({ isActive: true })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.userModel.countDocuments({ isActive: true });
        return {
            users: users.map((user) => this.transformUserResponse(user)),
            total,
        };
    }
    async updateFollowerCount(userId, increment) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followersCount: increment },
        });
    }
    async updateFollowingCount(userId, increment) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { followingCount: increment },
        });
    }
    transformUserResponse(user) {
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserService);
//# sourceMappingURL=user.service.js.map