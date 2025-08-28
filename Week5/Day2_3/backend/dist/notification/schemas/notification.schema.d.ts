import type { Document } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
export interface NotificationTimestamps {
    createdAt: Date;
    updatedAt: Date;
}
export type NotificationDocument = Notification & Document & NotificationTimestamps;
export declare enum NotificationType {
    COMMENT = "comment",
    REPLY = "reply",
    LIKE = "like",
    FOLLOW = "follow"
}
export declare class Notification {
    recipientId: string;
    senderId: string;
    type: NotificationType;
    message: string;
    commentId?: string;
    parentCommentId?: string;
    isRead: boolean;
    isActive: boolean;
}
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
}>;
