import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from './schemas/rating.schema';
import { ProductsService } from '../products/products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel('Rating') private model: Model<Rating>,
    private products: ProductsService,
    private notificationsGateway: NotificationsGateway
  ) {}

async create(userId: string, productId: string, stars: number, comment?: string) {
  let review;
  try {
    review = await this.model.create({
      userId: new Types.ObjectId(userId),  // ✅ force ObjectId
      productId: new Types.ObjectId(productId),
      stars,
      comment,
    });
  } catch (e: any) {
    if (e.code === 11000) throw new BadRequestException('You have already rated this product.');
    throw e;
  }

  const avg = await this.updateProductAverage(productId);

  // 🔹 notify all connected clients (socket.io)
  this.notificationsGateway.notifyNewReview(productId, review, avg);

  return { message: 'Rating submitted.', review, averageRating: avg };
}


async listForProduct(productId: string) {
  return this.model.find({ productId: new Types.ObjectId(productId) }).populate('userId', 'name').lean();
}

  async updateProductAverage(productId: string) {
    const agg = await this.model.aggregate([
      { $match: { productId: new (require('mongoose').Types.ObjectId)(productId) } },
      { $group: { _id: '$productId', avg: { $avg: '$stars' } } },
    ]);
    const avg = agg.length ? Number(agg[0].avg.toFixed(2)) : 0;
    await this.products.updateAverageRating(productId, avg);
    return avg;
  }
}
