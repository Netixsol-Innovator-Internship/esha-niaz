import { Model } from "mongoose";
import { type UserDocument } from "./schemas/user.schema";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserResponseDto } from "./dto/user-response.dto";
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserResponseDto>;
    findByUsername(username: string): Promise<UserResponseDto>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto>;
    uploadProfilePicture(userId: string, filename: string): Promise<UserResponseDto>;
    searchUsers(query: string, limit?: number): Promise<UserResponseDto[]>;
    getAllUsers(page?: number, limit?: number): Promise<{
        users: UserResponseDto[];
        total: number;
    }>;
    updateFollowerCount(userId: string, increment: number): Promise<void>;
    updateFollowingCount(userId: string, increment: number): Promise<void>;
    private transformUserResponse;
}
