import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async listUsers() {
    return this.userModel.find().select('-passwordHash').lean();
  }

  async updateRole(userId: string, role: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found.');
    user.role = role;
    await user.save();
    return { message: 'Role updated.' };
  }

  async updateProfile(userId: string, data: { fullName?: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found.');
    if (data.fullName) user.fullName = data.fullName;
    await user.save();
    return { message: 'Profile updated.' };
  }

  async getAllUserIds(): Promise<string[]> {
  const users = await this.userModel.find().select('_id').lean();
  return users.map(u => u._id.toString());
}
}
