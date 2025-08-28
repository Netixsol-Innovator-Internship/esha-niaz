import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { extname } from "path"
import  { UserService } from "./user.service"
import  { UpdateProfileDto } from "./dto/update-profile.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { AuthUser } from "../common/interfaces/auth-user.interface"
import { Express } from "express"
import { CurrentUser } from "src/common/decorators/current-user.decorator"

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getMyProfile(user: AuthUser) {
    return {
      message: "Profile retrieved successfully",
      user: await this.userService.findById(user._id),
    }
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return {
      message: "User retrieved successfully",
      user: await this.userService.findById(id),
    }
  }

  @Get("username/:username")
  async getUserByUsername(@Param("username") username: string) {
    return {
      message: "User retrieved successfully",
      user: await this.userService.findByUsername(username),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(@CurrentUser() user: AuthUser, @Body() updateProfileDto: UpdateProfileDto) {
    return {
      message: "Profile updated successfully",
      user: await this.userService.updateProfile(user._id, updateProfileDto),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("profile/upload")
  @UseInterceptors(
    FileInterceptor("profilePicture", {
      storage: diskStorage({
        destination: "./uploads/profiles",
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException("Only image files are allowed!"), false)
        }
        cb(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProfilePicture(@CurrentUser() user: AuthUser, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }

    return {
      message: "Profile picture uploaded successfully",
      user: await this.userService.uploadProfilePicture(user._id, file.filename),
    }
  }

  @Get()
  async getAllUsers(@Query("page") page: string = "1", @Query("limit") limit: string = "10") {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)

    const result = await this.userService.getAllUsers(pageNum, limitNum)
    return {
      message: "Users retrieved successfully",
      ...result,
      page: pageNum,
      limit: limitNum,
    }
  }

  @Get("search/:query")
  async searchUsers(@Param("query") query: string, @Query("limit") limit: string = "10") {
    const limitNum = Number.parseInt(limit, 10)
    return {
      message: "Search results retrieved successfully",
      users: await this.userService.searchUsers(query, limitNum),
    }
  }
}
