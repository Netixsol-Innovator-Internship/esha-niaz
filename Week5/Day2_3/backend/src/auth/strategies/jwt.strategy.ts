import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import  { Model } from "mongoose"
import { User,UserDocument } from "../../user/schemas/user.schema"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: process.env.JWT_SECRET || "your-secret-key",
      secretOrKey: "your-secret-key",
    })
    console.log("in jwt::")
  }

  async validate(payload: any) {
    console.log("in jwt::")
    const user = await this.userModel.findById(payload.sub).select("-password")
    console.log("user::",user)
    if (!user || !user.isActive) {
      throw new UnauthorizedException()
    }

      console.log('JWT Payload received:', payload);
  // console.log('JWT Secret:', process.env.JWT_SECRET || "your-secret-key");
    return {     _id: user._id.toString(),
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
    isActive: user.isActive,};
  }

}
