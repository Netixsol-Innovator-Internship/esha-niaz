import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AppGateway } from '../gateway/app.gateway';
import { Bid } from '../bids/schemas/bid.schema'; // adjust path if needed
import { Car } from '../cars/schemas/car.schema'; // adjust path if needed

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private model: Model<Notification>,
     @InjectModel(Bid.name) private bidModel: Model<Bid>, // add this line
     @InjectModel(Car.name) private carModel: Model<Car>, // add this line
    private gateway: AppGateway,

  ) {}

  async create(dto: CreateNotificationDto) {
    const doc = await this.model.create({
      ...dto,
      sender: dto.sender ? new Types.ObjectId(dto.sender) : undefined,
      receiver: new Types.ObjectId(dto.receiver),
      car: dto.car ? new Types.ObjectId(dto.car) : undefined,
      bid: dto.bid ? new Types.ObjectId(dto.bid) : undefined,
    });
    this.gateway.broadcast('notification', doc);
    return doc;
  }
async notifyCarOwnerAndBidders(carId: string, newBidderId: string) {
  const car = await this.carModel.findById(carId);
  if (!car) return;

  const carOwnerId = car.owner.toString();

  // Notify car owner
  await this.create({
    type: 'New',
    receiver: carOwnerId,
    sender: newBidderId,
    car: carId,
    comment: 'New bid on your car',
  });

  // Get previous bidders except the new bidder
  // const previousBids = await this.bidModel.find({ car: carId, user: { $ne: newBidderId } });
  const previousBids = await this.bidModel.find({
  car: new Types.ObjectId(carId),
  user: { $ne: new Types.ObjectId(newBidderId) }, // <-- convert to ObjectId
});
  const previousBidderIds = [...new Set(previousBids.map(b => b.user.toString()))];

  // Notify all previous bidders (except owner)
  await Promise.allSettled(
    previousBidderIds
      .filter(bidderId => bidderId !== carOwnerId)
      .map(bidderId =>
        this.create({
          type: 'New',
          receiver: bidderId,
          sender: newBidderId,
          car: carId,
          comment: 'A new bid was placed on a car you bid on',
        }),
      ),
  );
}




  listForUser(userId: string) {
    return this.model.find({ receiver: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  markRead(id: string) {
    return this.model.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}
