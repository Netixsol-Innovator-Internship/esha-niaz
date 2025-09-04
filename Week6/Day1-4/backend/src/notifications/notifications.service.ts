import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    private gateway: NotificationsGateway,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {}

  async saleStarted(product: any, userIds: string[]) {
    this.gateway.notifySaleStarted(product);
    // Store notification for each user
    const message = `Sale started on ${product.name}!`;
    await Promise.all(userIds.map(userId =>
      this.notificationModel.create({ userId, type: 'sale', message, productId: product._id })
    ));
  }


  // async orderCreated(order: any) {
  //   this.gateway.notifyOrderCreated(order);
  //   // Optionally store for admins
  // }

   // 🔹 Notify admins when an order is created
async orderCreated(order: any, adminIds: string[] = []) {
  this.gateway.notifyOrderCreated(order);
  if (adminIds.length > 0) {
    await Promise.all(
      adminIds.map(adminId =>
        this.notificationModel.create({
          userId: adminId,
          type: 'order',
          message: `New order created.`,
          productId: order._id,
        }),
      ),
    );
  }
}


  async orderStatusChanged(userId: string, order: any) {
    this.gateway.notifyOrderStatusChanged(userId, order);
    // Store notification for user
    await this.notificationModel.create({
      userId,
      type: 'order',
      message: `Order status updated: ${order.status}`,
      productId: order.productId
    });
  }

  // async productSoldOut(product: any) {
  //   this.gateway.notifyProductSoldOut(product);
  //   // Optionally store for admins
  // }

    // 🔹 Notify admins when a product is sold out
async productSoldOut(product: any, adminIds: string[] = []) {
  this.gateway.notifyProductSoldOut(product);
  if (adminIds.length > 0) {
    await Promise.all(
      adminIds.map(adminId =>
        this.notificationModel.create({
          userId: adminId,
          type: 'product',
          message: `${product.name} is sold out!`,
          productId: product._id,
        }),
      ),
    );
  }
}

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}