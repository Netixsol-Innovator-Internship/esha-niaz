import { Document } from "mongoose";
export interface UserTimestamps {
    createdAt: Date;
    updatedAt: Date;
}
export type UserDocument = User & Document & UserTimestamps;
export declare class User {
    username: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
    followersCount: number;
    followingCount: number;
    isActive: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
