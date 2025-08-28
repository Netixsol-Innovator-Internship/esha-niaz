import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { LikeController } from "./like.controller"
import { LikeService } from "./like.service"
import { Like, LikeSchema } from "./schemas/like.schema"
import { WebsocketModule } from "../websocket/websocket.module"
import { CommentModule } from "../comment/comment.module"
import { UserModule } from "../user/user.module"
import { NotificationModule } from "../notification/notification.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    WebsocketModule,
    CommentModule,       // 👈 keep inside imports array
    UserModule,          // 👈 keep inside imports array
    NotificationModule,  // 👈 keep inside imports array
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
