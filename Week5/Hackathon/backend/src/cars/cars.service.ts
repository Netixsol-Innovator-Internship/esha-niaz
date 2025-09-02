import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UsersService } from '../users/users.service';
import { AppGateway } from '../gateway/app.gateway';
import { Bid } from '../bids/schemas/bid.schema';
import { NotificationsService } from '../notifications/notifications.service'; // <- add this

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<Car>,
    private users: UsersService,
    private gateway: AppGateway,
    private notifications: NotificationsService, // <- inject
    @InjectModel(Bid.name) private bidModel: Model<Bid>, // ✅ works now
  ) {}

  async create(ownerId: string, dto: CreateCarDto) {
    const car = await this.carModel.create({
      owner: new Types.ObjectId(ownerId),
      ...dto,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      status: 'live',
    });
    await this.users.linkMyCar(ownerId, car._id.toString());
    this.gateway.broadcast('auction:start', { carId: car._id, make: car.make, model: car.carModel });
    return car;
  }

  // async findAll(query: any) {
  //   const filter: FilterQuery<Car> = {};
  //   if (query.make) filter.make = new RegExp(query.make, 'i');
  //   if (query.model) filter.model = new RegExp(query.model, 'i');
  //   if (query.year) filter.year = Number(query.year);
  //   if (query.minPrice || query.maxPrice) {
  //     filter.currentBid = {};
  //     if (query.minPrice) filter.currentBid.$gte = Number(query.minPrice);
  //     if (query.maxPrice) filter.currentBid.$lte = Number(query.maxPrice);
  //   }
  //   if (query.status) filter.status = query.status;
  //   return this.carModel.find(filter).sort({ createdAt: -1 });
  // }
// async findAll(query: any) {
//   const filter: FilterQuery<Car> = {};

//   if (query.make) filter.make = new RegExp(query.make.trim(), 'i');
//   if (query.model) filter.carModel = new RegExp(query.model.trim(), 'i'); // FIXED

//   if (query.year) filter.year = Number(query.year);

//   if (query.minPrice || query.maxPrice) {
//     filter.currentBid = {};
//     if (query.minPrice) filter.currentBid.$gte = Number(query.minPrice);
//     if (query.maxPrice) filter.currentBid.$lte = Number(query.maxPrice);
//   }

//   if (query.status) filter.status = query.status;

//   return this.carModel.find(filter).sort({ createdAt: -1 });
// }
async findAll(query: any) {
  const filter: FilterQuery<Car> = {};

  // normalize & fuzzy match for strings
  if (query.make && typeof query.make === 'string') {
    const make = query.make.trim();
    if (make.length) filter.make = new RegExp(make, 'i');
  }

  if (query.model && typeof query.model === 'string') {
    const model = query.model.trim();
    if (model.length) filter.carModel = new RegExp(model, 'i');
  }

  // year
  if (query.year) {
    const y = Number(query.year);
    if (!Number.isNaN(y)) filter.year = y;
  }

  // PRICE: use maxBid (listing price), not currentBid
  const minP = query.minPrice !== undefined ? Number(query.minPrice) : undefined;
  const maxP = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;
  if ((!Number.isNaN(minP) && minP !== undefined) || (!Number.isNaN(maxP) && maxP !== undefined)) {
    filter.maxBid = {};
    if (!Number.isNaN(minP) && minP !== undefined) filter.maxBid.$gte = minP;
    if (!Number.isNaN(maxP) && maxP !== undefined) filter.maxBid.$lte = maxP;
  }

  if (query.status) filter.status = query.status;

  // optional: console.log(filter) while debugging
  // console.log('cars.findAll filter:', filter);

  return this.carModel.find(filter).sort({ createdAt: -1 });
}

  // findOne(id: string) {
  //   return this.carModel.findById(id);
  // }
  findOne(id: string) {
  return this.carModel.findById(new Types.ObjectId(id));
}

  // async update(ownerId: string, id: string, dto: UpdateCarDto) {
  //   const car = await this.carModel.findById(id);
  //   if (!car) throw new NotFoundException('Car not found');
  //   if (car.owner.toString() !== ownerId) throw new ForbiddenException('Not your car');
  //   Object.assign(car, dto);
  //   return car.save();
  // }

  // async endAuction(id: string) {
  //   const car = await this.carModel.findById(id);
  //   if (!car) throw new NotFoundException('Car not found');
  //   car.status = 'ended';
  //   await car.save();
  //   this.gateway.broadcast('auction:end', { carId: car._id, topBid: car.currentBid, topBidder: car.topBidder });
  //   return car;
  // }
  async update(ownerId: string, id: string, dto: UpdateCarDto) {
  const car = await this.carModel.findById(id);
  if (!car) throw new NotFoundException('Car not found');
  if (car.owner.toString() !== ownerId) throw new ForbiddenException('Not your car');

  // Define fields that CAN be updated
  const allowedFields = [
    'vin',
    'year',
    'make',
    'carModel',   // ⚠️ note: your schema uses carModel, not model
    'mileage',
    'engineSize',
    'paint',
    'hasGccSpecs',
    'features',
    'accidentHistory',
    'fullServiceHistory',
    'modified',
    'description',
    'sellerType',
    'sellerFirstName',
    'sellerLastName',
    'sellerEmail',
    'sellerPhone',
    'photos',
  ];

  for (const key of allowedFields) {
    if (dto[key] !== undefined) {
      car[key] = dto[key];
    }
  }

  return car.save();
}
  async endAuction(id: string) {
  const car = await this.carModel.findById(new Types.ObjectId(id));
  if (!car) throw new NotFoundException('Car not found');
  car.status = 'ended';
  await car.save();
  this.gateway.broadcast('auction:end', { carId: car._id, topBid: car.currentBid, topBidder: car.topBidder });

    // Prepare notifications:
    // 1) Notify the owner that auction ended (with winner info if exists)
    try {
      const winnerId = car.topBidder ? car.topBidder.toString() : undefined;
      const ownerComment = winnerId
        ? `Your auction ended. Winner: ${winnerId}, amount: ${car.currentBid}`
        : `Your auction ended. No winner.`;
      await this.notifications.create({
        type: 'End',
        sender: winnerId || undefined, // optional sender
        receiver: car.owner.toString(),
        car: car._id.toString(),
        bid: undefined,
        comment: ownerComment,
      });
    } catch (err) {
      console.error('Failed to create owner end notification', err);
    }

    // 2) Notify the winner (if any) with type 'Win'
    if (car.topBidder) {
      try {
        await this.notifications.create({
          type: 'Win',
          sender: car.owner.toString(),
          receiver: car.topBidder.toString(),
          car: car._id.toString(),
          comment: `Congratulations! You won the auction with ${car.currentBid}.`,
        });
      } catch (err) {
        console.error('Failed to create win notification', err);
      }
    }

    // 3) Notify all participants (distinct users) that auction ended (include those who participated)
    try {
      const participantIds = await this.bidModel.distinct('user', { car: car._id });
      const uniqueIds = Array.from(new Set(participantIds.map(String)));

      const otherParticipantIds = uniqueIds.filter(id => id !== car.topBidder?.toString() && id !== car.owner.toString());

      const participantPromises = otherParticipantIds.map(pid =>
        this.notifications.create({
          type: 'End',
          sender: car.owner.toString(),
          receiver: pid,
          car: car._id.toString(),
          comment: `Auction ended for car ${car._id}. Final price: ${car.currentBid}`,
        }),
      );

      await Promise.allSettled(participantPromises);
    } catch (err) {
      console.error('Failed to create participant end notifications', err);
    }

  return car;
}

// // live acution cars 
// async findAllLive() {
//   return this.carModel
//     .find({
//       status: 'live',
//       endTime: { $gt: new Date() }, // make sure auction not ended
//     })
//     .sort({ createdAt: -1 })
//     .populate('topBidder', 'username fullName') // optional: populate top bidder info
//     .exec();
// }
// live auction cars
async findAllLive() {
  // 1. Get all live cars
  const cars = await this.carModel
    .find({
      status: 'live',
      endTime: { $gt: new Date() },
    })
    .sort({ createdAt: -1 })
    .populate('topBidder', 'username fullName')
    .lean();

  if (!cars.length) return [];

  const carIds = cars.map(c => c._id);

  // 2. Fetch all bids for these cars
  const bids = await this.bidModel
    .find({ car: { $in: carIds } })
    .populate('user', 'username fullName')
    .lean();

  // 3. Group bids by carId
  const bidsByCar = bids.reduce((acc, bid) => {
    const id = bid.car.toString();
    if (!acc[id]) acc[id] = [];
    acc[id].push({
      bidder: bid.user,
      amount: bid.amount,
       time: (bid as any).createdAt, // ✅ bypass TS error
    });
    return acc;
  }, {} as Record<string, any[]>);

  // 4. Attach totalBids + biddersList to each car
  return cars.map(car => {
    const carId = car._id.toString(); // ✅ fix typing issue
    return {
      ...car,
      totalBids: bidsByCar[carId]?.length || 0,
      biddersList: bidsByCar[carId] || [],
    };
  });
}

// My cars (shows both live + ended cars of the owner)
async findMyCars(ownerId: string) {
  // 1. Get all cars of this owner (no matter if live or ended)
  const cars = await this.carModel
    .find({
      owner: new Types.ObjectId(ownerId), // 👈 important
    })
    .sort({ createdAt: -1 })
    .populate('topBidder', 'username fullName')
    .lean();

  if (!cars.length) return [];

  const carIds = cars.map(c => c._id);

  // 2. Fetch all bids for these cars
  const bids = await this.bidModel
    .find({ car: { $in: carIds } })
    .populate('user', 'username fullName')
    .lean();

  // 3. Group bids by carId
  const bidsByCar = bids.reduce((acc, bid) => {
    const id = bid.car.toString();
    if (!acc[id]) acc[id] = [];
    acc[id].push({
      bidder: bid.user,
      amount: bid.amount,
      time: (bid as any).createdAt, // ✅ bypass TS error
    });
    return acc;
  }, {} as Record<string, any[]>);

  // 4. Attach totalBids + biddersList to each car
  return cars.map(car => {
    const carId = car._id.toString();
    return {
      ...car,
      totalBids: bidsByCar[carId]?.length || 0,
      biddersList: bidsByCar[carId] || [],
    };
  });
}


}
