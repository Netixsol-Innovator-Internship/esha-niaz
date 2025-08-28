import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { NotificationController } from "./notification.controller"
import { NotificationService } from "./notification.service"
import { Notification, NotificationSchema } from "./schemas/notification.schema"
import { UserModule } from "../user/user.module" // 👈 import user module

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  UserModule,
  
            ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
