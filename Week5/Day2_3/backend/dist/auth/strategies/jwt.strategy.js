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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const mongoose_1 = require("mongoose");
const user_schema_1 = require("../../user/schemas/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userModel) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "your-secret-key",
        });
        this.userModel = userModel;
        console.log("in jwt::");
    }
    async validate(payload) {
        console.log("in jwt::");
        const user = await this.userModel.findById(payload.sub).select("-password");
        console.log("user::", user);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException();
        }
        console.log('JWT Payload received:', payload);
        return { _id: user._id.toString(),
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followersCount ?? 0,
            followingCount: user.followingCount ?? 0,
            isActive: user.isActive, };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map