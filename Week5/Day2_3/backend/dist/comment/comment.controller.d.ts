import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthUser } from "../common/interfaces/auth-user.interface";
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    createComment(createCommentDto: CreateCommentDto, user: AuthUser): Promise<{
        message: string;
        comment: import("./dto/comment-response.dto").CommentResponseDto;
    }>;
    getComments(page?: string, limit?: string, userId?: string): Promise<{
        page: number;
        limit: number;
        comments: import("./dto/comment-response.dto").CommentResponseDto[];
        total: number;
        message: string;
    }>;
    getCommentById(id: string, userId?: string): Promise<{
        message: string;
        comment: import("./dto/comment-response.dto").CommentResponseDto;
    }>;
    getReplies(parentId: string, page?: string, limit?: string, userId?: string): Promise<{
        message: string;
        replies: import("./dto/comment-response.dto").CommentResponseDto[];
        page: number;
        limit: number;
    }>;
    updateComment(id: string, updateCommentDto: UpdateCommentDto, user: AuthUser): Promise<{
        message: string;
        comment: import("./dto/comment-response.dto").CommentResponseDto;
    }>;
    deleteComment(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
