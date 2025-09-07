import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string, Set<string>>(); // userId -> socketIds

  handleConnection(client: Socket) {
    const userId = (client.handshake.auth && client.handshake.auth.userId) || (client.handshake.query && (client.handshake.query as any).userId);
    const role = (client.handshake.auth && client.handshake.auth.role) || (client.handshake.query && (client.handshake.query as any).role);
    if (userId) {
      if (!this.users.has(userId)) this.users.set(userId, new Set());
      this.users.get(userId)!.add(client.id);
      client.join(`user:${userId}`);
    }
    if (role === 'admin' || role === 'superadmin') {
      client.join('admins');
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, set] of this.users) {
      if (set.has(client.id)) {
        set.delete(client.id);
        if (set.size === 0) this.users.delete(userId);
      }
    }
  }

  notifySaleStarted(product: any) {
    this.server.emit('sale.started', { product });
  }

  notifyOrderCreated(order: any) {
    this.server.to('admins').emit('order.created', { order });
  }

  notifyOrderStatusChanged(userId: string, order: any) {
    this.server.to(`user:${userId}`).emit('order.status.changed', { order });
  }

  notifyProductSoldOut(product: any) {
    this.server.to('admins').emit('product.soldout', { product });
  }


  notifyNewReview(productId: string, review: any, averageRating: number) {
  // Sabko jo us product ka page dekh rahe hain (room join karwayenge frontend se)
  this.server.to(`product:${productId}`).emit('review.new', { review, averageRating });
}
}
