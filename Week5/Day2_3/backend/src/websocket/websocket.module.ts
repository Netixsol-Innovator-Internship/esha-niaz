import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { WebsocketGateway } from "./websocket.gateway"
import { NotificationModule } from "../notification/notification.module"

@Module({
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_SECRET || "your-secret-key",
      secret: "your-secret-key",
      signOptions: { expiresIn: "7d" },
    }),
    NotificationModule,
  ],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
