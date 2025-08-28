import { Document } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
export type FollowerDocument = Follower & Document;
export declare class Follower {
    followerId: string;
    followingId: string;
    isActive: boolean;
}
export declare const FollowerSchema: MongooseSchema<Follower, import("mongoose").Model<Follower, any, any, any, Document<unknown, any, Follower> & Follower & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Follower, Document<unknown, {}, import("mongoose").FlatRecord<Follower>> & import("mongoose").FlatRecord<Follower> & {
    _id: import("mongoose").Types.ObjectId;
}>;
