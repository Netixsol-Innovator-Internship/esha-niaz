import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async onModuleInit() {
    const email = process.env.SUPERADMIN_EMAIL as string;
    const exists = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!exists) {
      const user = await this.userModel.create({
        username: (process.env.SUPERADMIN_USERNAME as string).toLowerCase(),
        email: email.toLowerCase(),
        fullName: process.env.SUPERADMIN_FULLNAME,
        passwordHash: await bcrypt.hash(process.env.SUPERADMIN_PASSWORD as string, 10),
        role: 'superadmin',
        verified: true,
        loyaltyPoints: 0,
      });
      this.logger.log(`SuperAdmin created: ${user.email}`);
    } else if (exists.role !== 'superadmin') {
      exists.role = 'superadmin';
      exists.verified = true;
      await exists.save();
      this.logger.log(`Existing user promoted to SuperAdmin: ${exists.email}`);
    } else {
      this.logger.log(`SuperAdmin already exists: ${exists.email}`);
    }
  }
}
