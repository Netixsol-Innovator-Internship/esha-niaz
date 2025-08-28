import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { CommentModule } from "./comment/comment.module"
import { NotificationModule } from "./notification/notification.module"
import { FollowerModule } from "./follower/follower.module"
import { LikeModule } from "./like/like.module"
import { WebsocketModule } from "./websocket/websocket.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/comment-system"),
    AuthModule,
    UserModule,
    CommentModule,
    NotificationModule,
    FollowerModule,
    LikeModule,
    WebsocketModule,
  ],
})
export class AppModule {}
