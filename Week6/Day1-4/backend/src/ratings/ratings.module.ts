import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { ProductsModule } from '../products/products.module';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
    ProductsModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService , NotificationsGateway],
  exports: [RatingsService],
})
export class RatingsModule {}
