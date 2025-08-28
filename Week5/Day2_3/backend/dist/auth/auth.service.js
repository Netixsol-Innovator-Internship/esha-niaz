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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoose_2 = require("@nestjs/mongoose");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { username, email, password } = registerDto;
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email or username already exists");
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new this.userModel({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        const payload = { username: user.username, sub: user._id };
        const token = this.jwtService.sign(payload);
        return {
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
            },
            token,
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { username: user.username, sub: user._id };
        const token = this.jwtService.sign(payload);
        console.log('user:', user);
        return {
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
            },
            token,
        };
    }
    async validateUser(usernameOrEmail, password) {
        const user = await this.userModel.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async findById(id) {
        return this.userModel.findById(id).select("-password");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map