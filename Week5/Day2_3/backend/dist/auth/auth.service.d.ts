import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { UserDocument } from "../user/schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: any;
            username: string;
            email: string;
            bio: string;
            profilePicture: string;
            followersCount: number;
            followingCount: number;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            _id: any;
            username: any;
            email: any;
            bio: any;
            profilePicture: any;
            followersCount: any;
            followingCount: any;
        };
        token: string;
    }>;
    validateUser(usernameOrEmail: string, password: string): Promise<any>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("../user/schemas/user.schema").User & import("mongoose").Document<any, any, any> & import("../user/schemas/user.schema").UserTimestamps & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
