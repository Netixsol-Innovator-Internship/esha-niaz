import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    console.log('inside profile api')
    return {
      message: "Profile retrieved successfully",
      user: req.user,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("verify")
  verifyToken(@Request() req) {
    return {
      message: "Token is valid",
      user: req.user,
    }
  }
}
