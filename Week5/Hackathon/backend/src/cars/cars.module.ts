// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Car, CarSchema } from './schemas/car.schema';
// import { CarsService } from './cars.service';
// import { CarsController } from './cars.controller';
// import { UsersModule } from '../users/users.module';
// import { CarsCron } from './cars.cron';
// import { AppGateway } from '../gateway/app.gateway';

// @Module({
//   imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]), UsersModule],
//   controllers: [CarsController],
//   providers: [CarsService, AppGateway, CarsCron],
//   exports: [MongooseModule, CarsService],
// })
// export class CarsModule {}



import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { UsersModule } from '../users/users.module';
import { CarsCron } from './cars.cron';
import { AppGateway } from '../gateway/app.gateway';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Bid, BidSchema } from '../bids/schemas/bid.schema'; // ✅ import Bid schema
import { NotificationsModule } from '../notifications/notifications.module'; // add


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema },
      { name: Bid.name, schema: BidSchema }, // ✅ register Bid schema
    ]),
    UsersModule,
    CloudinaryModule, // <-- add this
    NotificationsModule, // <-- add this
    
  ],
  controllers: [CarsController],
  providers: [CarsService, AppGateway, CarsCron],
  exports: [MongooseModule, CarsService],
})
export class CarsModule {}
