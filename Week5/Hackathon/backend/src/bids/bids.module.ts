import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { UsersModule } from '../users/users.module';
import { AppGateway } from '../gateway/app.gateway';
import { NotificationsModule } from '../notifications/notifications.module'; // add

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Car.name, schema: CarSchema },
    ]),
    UsersModule,
    forwardRef(() => NotificationsModule), // <-- use forwardRefs
  ],
  controllers: [BidsController],
  providers: [BidsService, AppGateway],
  exports:  [
    MongooseModule, // <--- Export MongooseModule here so other modules can inject BidModel & CarModel
    BidsService,    // optional
  ],
})
export class BidsModule {}
