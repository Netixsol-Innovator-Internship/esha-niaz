import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async signup(dto: SignupDto) {
    const exists = await this.usersService.findByUsername(dto.username);
    if (exists) throw new ConflictException('Username already taken');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      username: dto.username,
      password: hash,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
    });
    const token = this.jwt.sign({ sub: user._id.toString(), username: user.username });
    return { access_token: token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwt.sign({ sub: user._id.toString(), username: user.username });
    return { access_token: token, user };
  }
}
