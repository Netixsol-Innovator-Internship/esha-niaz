import { LikeService } from "./like.service";
import { LikeDto } from "./dto/like.dto";
import { AuthUser } from "../common/interfaces/auth-user.interface";
export declare class LikeController {
    private likeService;
    constructor(likeService: LikeService);
    likeComment(likeDto: LikeDto, user: AuthUser): Promise<{
        message: string;
        like: import("mongoose").Document<unknown, {}, import("./schemas/like.schema").LikeDocument> & import("./schemas/like.schema").Like & import("mongoose").Document<any, any, any> & import("./schemas/like.schema").LikeTimestamps & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    unlikeComment(commentId: string, user: AuthUser): Promise<{
        message: string;
    }>;
    getCommentLikes(commentId: string, page?: string, limit?: string): Promise<{
        likes: {
            id: any;
            user: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserLikes(userId: string, page?: string, limit?: string): Promise<{
        likes: {
            id: any;
            comment: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getLikeStatus(commentId: string, user: AuthUser): Promise<{
        message: string;
        isLiked: boolean;
    }>;
}
