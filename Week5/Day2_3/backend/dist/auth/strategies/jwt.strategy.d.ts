import { Strategy } from "passport-jwt";
import { Model } from "mongoose";
import { UserDocument } from "../../user/schemas/user.schema";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(payload: any): Promise<{
        _id: any;
        username: string;
        email: string;
        bio: string;
        profilePicture: string;
        followersCount: number;
        followingCount: number;
        isActive: true;
    }>;
}
export {};
