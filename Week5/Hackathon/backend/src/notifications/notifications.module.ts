import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AppGateway } from '../gateway/app.gateway';
import { BidsModule } from '../bids/bids.module'; // <--- add this import

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
forwardRef(() => BidsModule), // <-- use forwardRef
],
  controllers: [NotificationsController],
  providers: [NotificationsService, AppGateway],
  exports: [MongooseModule, NotificationsService],
})
export class NotificationsModule {}
