import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid } from './schemas/bid.schema';
import { Car } from '../cars/schemas/car.schema';
import { UsersService } from '../users/users.service';
import { AppGateway } from '../gateway/app.gateway';
import { NotificationsService } from '../notifications/notifications.service'; // <- add this


@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    private users: UsersService,
    private gateway: AppGateway,
    private notifications: NotificationsService, // <- inject
  ) {}

  async create(userId: string, carId: string, amount: number) {
    const car = await this.carModel.findById(carId);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() === userId) throw new ForbiddenException('Cannot bid on your own car');
    if (car.status !== 'live') throw new BadRequestException('Auction is not live');
    if (car.endTime && car.endTime.getTime() < Date.now()) throw new BadRequestException('Auction ended');
    if (amount <= car.currentBid) throw new BadRequestException('Bid must be higher than current bid');
    if (amount > car.maxBid) throw new BadRequestException('Bid exceeds max bid');

    const bid = await this.bidModel.create({
      user: new Types.ObjectId(userId),
      car: new Types.ObjectId(carId),
      amount,
    });

    car.currentBid = amount;
    car.topBidder = new Types.ObjectId(userId);
    await car.save();

    await this.users.linkMyBid(userId, bid._id.toString());

    // // Real-time updates
    // this.gateway.broadcast('bid:new', { carId, amount, userId });
      // --- Prepare real-time data ---
  const totalBids = await this.bidModel.countDocuments({ car: car._id });
  const bidderIds = await this.bidModel.distinct('user', { car: car._id });

  // Real-time updates: bid + total bids + bidder list
  this.gateway.broadcast('bid:new', {
    carId,
    amount,
    userId,
    currentBid: car.currentBid,
    totalBids,
    bidderList: bidderIds,
  });
    this.gateway.broadcast('notification', { type: 'New', carId, amount, userId, owner: car.owner });

      // --- Notifications: call your NotificationsService helper ---
  try {
    await this.notifications.notifyCarOwnerAndBidders(carId, userId);
  } catch (err) {
    console.error('Failed to notify owner or previous bidders:', err);
  }

    return bid;
  }

  // listForCar(carId: string) {
  //   return this.bidModel.find({ car: carId }).sort({ createdAt: -1 }).populate('user', 'username fullName');
  // }

  listForCar(carId: string) {
  return this.bidModel.find({ car: new Types.ObjectId(carId) })
    .sort({ createdAt: -1 })
    .populate('user', 'username fullName');
}

  // listForUser(userId: string) {
  //   return this.bidModel.find({ user: userId }).sort({ createdAt: -1 }).populate('car');
  // }
  listForUser(userId: string) {
  return this.bidModel.find({ user: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .populate('car');
}
}
