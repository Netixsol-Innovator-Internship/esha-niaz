import { FollowerService } from "./follower.service";
import { FollowDto } from "./dto/follow.dto";
import { AuthUser } from "../common/interfaces/auth-user.interface";
export declare class FollowerController {
    private followerService;
    constructor(followerService: FollowerService);
    followUser(user: AuthUser, followDto: FollowDto): Promise<{
        message: string;
        follow: import("mongoose").Document<unknown, {}, import("./schemas/follower.schema").FollowerDocument> & import("./schemas/follower.schema").Follower & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    unfollowUser(user: AuthUser, userId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string, page?: string, limit?: string): Promise<{
        followers: string[];
        total: number;
        page: number;
        limit: number;
    }>;
    getFollowing(userId: string, page?: string, limit?: string): Promise<{
        following: string[];
        total: number;
        page: number;
        limit: number;
    }>;
    isFollowing(user: AuthUser, userId: string): Promise<{
        message: string;
        isFollowing: boolean;
    }>;
}
