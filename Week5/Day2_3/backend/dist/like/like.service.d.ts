import { Model } from "mongoose";
import { Like, LikeDocument } from "./schemas/like.schema";
import { CommentService } from "../comment/comment.service";
import { UserService } from "../user/user.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { NotificationService } from "../notification/notification.service";
export declare class LikeService {
    private likeModel;
    private commentService;
    private userService;
    private websocketGateway;
    private notificationService;
    constructor(likeModel: Model<LikeDocument>, commentService: CommentService, userService: UserService, websocketGateway: WebsocketGateway, notificationService: NotificationService);
    likeComment(userId: string, commentId: string): Promise<{
        message: string;
        like: import("mongoose").Document<unknown, {}, LikeDocument> & Like & import("mongoose").Document<any, any, any> & import("./schemas/like.schema").LikeTimestamps & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    unlikeComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
    isLikedByUser(userId: string, commentId: string): Promise<boolean>;
    getCommentLikes(commentId: string, page?: number, limit?: number): Promise<{
        likes: {
            id: any;
            user: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserLikes(userId: string, page?: number, limit?: number): Promise<{
        likes: {
            id: any;
            comment: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMultipleLikeStatus(userId: string, commentIds: string[]): Promise<Record<string, boolean>>;
}
