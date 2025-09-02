import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true });
  }

  async addToWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: new Types.ObjectId(carId) } },
      { new: true },
    );
  }

  async removeFromWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: new Types.ObjectId(carId) } },
      { new: true },
    );
  }

  async linkMyCar(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myCars: new Types.ObjectId(carId) } },
      { new: true },
    );
  }

  async linkMyBid(userId: string, bidId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myBids: new Types.ObjectId(bidId) } },
      { new: true },
    );
  }
}
