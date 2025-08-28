import { Document } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
export interface LikeTimestamps {
    createdAt: Date;
    updatedAt: Date;
}
export type LikeDocument = Like & Document & LikeTimestamps;
export declare class Like {
    userId: string;
    commentId: string;
    isActive: boolean;
}
export declare const LikeSchema: MongooseSchema<Like, import("mongoose").Model<Like, any, any, any, Document<unknown, any, Like> & Like & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Like, Document<unknown, {}, import("mongoose").FlatRecord<Like>> & import("mongoose").FlatRecord<Like> & {
    _id: import("mongoose").Types.ObjectId;
}>;
