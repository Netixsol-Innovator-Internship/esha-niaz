import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"   // ✅ correct import
import { User, type UserDocument } from "./schemas/user.schema"
import { UpdateProfileDto } from "./dto/update-profile.dto"
import { UserResponseDto } from "./dto/user-response.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // ✅ tells NestJS which model
  ) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).select("-password")
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return this.transformUserResponse(user)
  }

  async findByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ username }).select("-password")
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return this.transformUserResponse(user)
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Update only provided fields
    if (updateProfileDto.bio !== undefined) {
      user.bio = updateProfileDto.bio
    }
    if (updateProfileDto.profilePicture !== undefined) {
      user.profilePicture = updateProfileDto.profilePicture
    }

    await user.save()
    return this.transformUserResponse(user)
  }

  async uploadProfilePicture(userId: string, filename: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    user.profilePicture = `/uploads/profiles/${filename}`
    await user.save()
    return this.transformUserResponse(user)
  }

  async searchUsers(query: string, limit = 10): Promise<UserResponseDto[]> {
    const users = await this.userModel
      .find({
        $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
        isActive: true,
      })
      .select("-password")
      .limit(limit)

    return users.map((user) => this.transformUserResponse(user))
  }

  async getAllUsers(page = 1, limit = 10): Promise<{ users: UserResponseDto[]; total: number }> {
    const skip = (page - 1) * limit
    const users = await this.userModel
      .find({ isActive: true })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await this.userModel.countDocuments({ isActive: true })

    return {
      users: users.map((user) => this.transformUserResponse(user)),
      total,
    }
  }

  async updateFollowerCount(userId: string, increment: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followersCount: increment },
    })
  }

  async updateFollowingCount(userId: string, increment: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { followingCount: increment },
    })
  }

  private transformUserResponse(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}


