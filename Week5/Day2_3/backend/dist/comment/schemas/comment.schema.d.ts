import type { Document } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
export interface CommentTimestamps {
    createdAt: Date;
    updatedAt: Date;
}
export type CommentDocument = Comment & Document & CommentTimestamps;
export declare class Comment {
    authorId: string;
    content: string;
    parentId: string | null;
    likesCount: number;
    repliesCount: number;
    isEdited: boolean;
    isActive: boolean;
    editedAt: Date;
}
export declare const CommentSchema: MongooseSchema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
}>;
