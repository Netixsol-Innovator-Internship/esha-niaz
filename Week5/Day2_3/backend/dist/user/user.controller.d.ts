import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthUser } from "../common/interfaces/auth-user.interface";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMyProfile(user: AuthUser): Promise<{
        message: string;
        user: import("./dto/user-response.dto").UserResponseDto;
    }>;
    getUserById(id: string): Promise<{
        message: string;
        user: import("./dto/user-response.dto").UserResponseDto;
    }>;
    getUserByUsername(username: string): Promise<{
        message: string;
        user: import("./dto/user-response.dto").UserResponseDto;
    }>;
    updateProfile(user: AuthUser, updateProfileDto: UpdateProfileDto): Promise<{
        message: string;
        user: import("./dto/user-response.dto").UserResponseDto;
    }>;
    uploadProfilePicture(user: AuthUser, file: Express.Multer.File): Promise<{
        message: string;
        user: import("./dto/user-response.dto").UserResponseDto;
    }>;
    getAllUsers(page?: string, limit?: string): Promise<{
        page: number;
        limit: number;
        users: import("./dto/user-response.dto").UserResponseDto[];
        total: number;
        message: string;
    }>;
    searchUsers(query: string, limit?: string): Promise<{
        message: string;
        users: import("./dto/user-response.dto").UserResponseDto[];
    }>;
}
