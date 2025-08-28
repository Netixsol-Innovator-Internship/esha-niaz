import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { AuthService } from "../auth.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "usernameOrEmail",
    })
    console.log("in local strategy::")
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(usernameOrEmail, password)
    console.log("user",user)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return user
  }
}
