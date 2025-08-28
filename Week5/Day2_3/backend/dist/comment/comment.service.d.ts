import { Model } from "mongoose";
import { CommentDocument } from "./schemas/comment.schema";
import { UserService } from "../user/user.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { NotificationService } from "../notification/notification.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentResponseDto } from "./dto/comment-response.dto";
export declare class CommentService {
    private commentModel;
    private userService;
    private websocketGateway;
    private notificationService;
    constructor(commentModel: Model<CommentDocument>, userService: UserService, websocketGateway: WebsocketGateway, notificationService: NotificationService);
    createComment(userId: string, createCommentDto: CreateCommentDto): Promise<CommentResponseDto>;
    getComments(page?: number, limit?: number, userId?: string): Promise<{
        comments: CommentResponseDto[];
        total: number;
    }>;
    getReplies(parentId: string, page?: number, limit?: number, userId?: string): Promise<CommentResponseDto[]>;
    getCommentById(commentId: string, userId?: string): Promise<CommentResponseDto>;
    updateComment(commentId: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto>;
    deleteComment(commentId: string, userId: string): Promise<void>;
    updateLikeCount(commentId: string, increment: number): Promise<void>;
    private transformCommentResponse;
}
