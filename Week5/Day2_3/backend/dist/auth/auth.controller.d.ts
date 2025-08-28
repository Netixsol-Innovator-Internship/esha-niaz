import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): {
        message: string;
        user: any;
    };
    verifyToken(req: any): {
        message: string;
        user: any;
    };
}
