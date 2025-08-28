import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CommentController } from "./comment.controller"
import { CommentService } from "./comment.service"
import { Comment, CommentSchema } from "./schemas/comment.schema"
import { WebsocketModule } from "../websocket/websocket.module"
import { UserModule } from "../user/user.module"
import { NotificationModule } from "../notification/notification.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    WebsocketModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
