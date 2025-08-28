import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FollowerController } from "./follower.controller"
import { FollowerService } from "./follower.service"
import { Follower, FollowerSchema } from "./schemas/follower.schema"
import { UserModule } from "../user/user.module"
import { WebsocketModule } from "../websocket/websocket.module"
import { NotificationModule } from "../notification/notification.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follower.name, schema: FollowerSchema }]),
    UserModule,
    WebsocketModule,
    NotificationModule,
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
  exports: [FollowerService],
})
export class FollowerModule {}
