import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class AppGateway {
  @WebSocketServer() server: Server;

  broadcast(event: string, payload: any) {
    if (this.server) this.server.emit(event, payload);
  }
}
