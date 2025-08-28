import { Model } from "mongoose";
import { Follower, FollowerDocument } from "./schemas/follower.schema";
import { UserService } from "../user/user.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { NotificationService } from "../notification/notification.service";
export declare class FollowerService {
    private followerModel;
    private readonly userService;
    private readonly websocketGateway;
    private readonly notificationService;
    constructor(followerModel: Model<FollowerDocument>, userService: UserService, websocketGateway: WebsocketGateway, notificationService: NotificationService);
    followUser(followerId: string, followingId: string): Promise<{
        message: string;
        follow: import("mongoose").Document<unknown, {}, FollowerDocument> & Follower & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    unfollowUser(followerId: string, followingId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        followers: string[];
        total: number;
        page: number;
        limit: number;
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        following: string[];
        total: number;
        page: number;
        limit: number;
    }>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
}
