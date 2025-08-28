import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common"
import  { JwtService } from "@nestjs/jwt"
import { Model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { UserDocument } from "../user/schemas/user.schema"
import  { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AuthService {
  // private userModel: Model<UserDocument>
  // private jwtService: JwtService

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>, // ✅ Fix here
    private readonly jwtService: JwtService // ✅ DI works automatically for JwtService
  ) {}
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      throw new ConflictException("User with this email or username already exists")
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate JWT token
    const payload = { username: user.username, sub: user._id }
    const token = this.jwtService.sign(payload)

    return {
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
      },
      token,
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = { username: user.username, sub: user._id }
    const token = this.jwtService.sign(payload)
    console.log('user:', user)

    return {
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
      },
      token,
    }
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async findById(id: string) {
    return this.userModel.findById(id).select("-password")
  }
}
