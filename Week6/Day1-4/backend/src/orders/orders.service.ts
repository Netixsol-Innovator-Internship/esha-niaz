// // 



// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Order } from './schemas/order.schema';
// import { ProductsService } from '../products/products.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { UsersService } from '../users/users.service';
// import { User } from '../users/schemas/user.schema';
// import { Cart } from '../carts/schemas/cart.schema';

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectModel(Order.name) private model: Model<Order>,   // ✅ use Order.name instead of string
//     @InjectModel(User.name) private readonly userModel: Model<User>,  // ✅ injected User model
//     @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
//     private products: ProductsService,
//     private users: UsersService,
//     private notifications: NotificationsService,
//   ) {}

//   async create(user: any, dto: any) {
//     let subtotal = 0;
//     const items = [];

//     for (const it of dto.items) {
//       const p = await this.products.detail(it.productId);

//       // loyalty validations
//       if (dto.paymentMethod === 'points' && p.loyaltyType === 'cash') {
//         throw new BadRequestException('This product cannot be bought with points.');
//       }
//       if (dto.paymentMethod === 'card' || dto.paymentMethod === 'cod') {
//         if (p.loyaltyType === 'points') {
//           throw new BadRequestException('This product can only be bought with points.');
//         }
//       }

//       // Sale price logic
//       const unitPrice =
//         p.sale && p.sale.active && p.sale.salePrice > 0
//           ? p.sale.salePrice
//           : p.price;

//       items.push({
//         productId: it.productId,
//         name: p.name,
//         unitPrice,
//         quantity: it.quantity,
//         selectedSize: it.selectedSize,
//         selectedColor: it.selectedColor,
//       });
//       subtotal += unitPrice * it.quantity;
//     }

//     const deliveryFee = 15;
//     const total = subtotal + deliveryFee;

//     // Deduct points if points/hybrid
//     if (dto.paymentMethod === 'points' || dto.paymentMethod === 'hybrid') {
//       const u = await this.users.findById(user.id);
//       const available = u?.loyaltyPoints || 0;
//       const needed = Math.ceil(total);

//       if (available < needed && dto.paymentMethod === 'points') {
//         throw new BadRequestException('Not enough loyalty points.');
//       }

//       const deduct =
//         dto.paymentMethod === 'points'
//           ? needed
//           : Math.min(available, needed);

//       // ✅ Use injected userModel
//       await this.userModel.findByIdAndUpdate(user.id, {
//         $inc: { loyaltyPoints: -deduct },
//       });
//     }

//     // Reserve stock & increase sales
//     for (const it of dto.items) {
//       await this.products.adjustStockAndSales(it.productId, it.quantity, true);
//     }

//     const order = await this.model.create({
//       userId: user.id,
//       items,
//       subtotal,
//       discount: 0,
//       deliveryFee,
//       total,
//       paymentMethod: dto.paymentMethod,
//       status: 'active',
//       address: dto.address,
//       paymentInfo: dto.paymentInfo || {},
//     });

//     const created = order.toObject();
//     this.notifications.orderCreated(created);

//     // Sold out notifications
//     for (const it of created.items) {
//       const p = await this.products.detail(String(it.productId));
//       if (p.stockQuantity <= 0) this.notifications.productSoldOut(p);
//     }

//     return created;
//   }

//   myOrders(userId: string) {
//     return this.model.find({ userId }).sort({ createdAt: -1 }).lean();
//   }

//   recent(days = 4) {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
//     return this.model
//       .find({ createdAt: { $gte: since } })
//       .sort({ createdAt: -1 })
//       .lean();
//   }

//   async setStatus(
//     orderId: string,
//     status: 'delivered' | 'completed' | 'canceled',
//   ) {
//     const order = await this.model.findById(orderId);
//     if (!order) throw new BadRequestException('Order not found');

//     if (status === 'canceled') {
//       for (const it of order.items) {
//         await this.products.restoreStock(it.productId, it.quantity);
//       }
//     }

//     order.status = status;
//     await order.save();
//     this.notifications.orderStatusChanged(
//       String(order.userId),
//       order.toObject(),
//     );

//     // ✅ Use injected userModel here too
//     if (
//       (status === 'delivered' || status === 'completed') &&
//       (order.paymentMethod === 'cod' ||
//         order.paymentMethod === 'card' ||
//         order.paymentMethod === 'hybrid')
//     ) {
//       const earn = Math.floor((order.total - order.deliveryFee) / 100); 
//       await this.userModel.findByIdAndUpdate(order.userId, {
//         $inc: { loyaltyPoints: earn },
//       });
//     }

//     const created = order.toObject();
//     this.notifications.orderCreated(created);

//     for (const it of created.items) {
//       const p = await this.products.detail(String(it.productId));
//       if (p.stockQuantity <= 0) this.notifications.productSoldOut(p);
//     }

//     return created;
//   }
// }




import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { Cart } from '../carts/schemas/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private products: ProductsService,
    private users: UsersService,
    private notifications: NotificationsService,
  ) {}

  async create(user: any, dto: any) {
    // ✅ 1. Get cart
    const cart = await this.cartModel.findById(dto.cartId).lean();
    if (!cart || String(cart.userId) !== String(user.id)) {
      throw new BadRequestException('Invalid cart');
    }
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const items = [];
    let subtotal = 0;

    // ✅ 2. Validate products & loyalty rules
    for (const it of cart.items) {
      const p = await this.products.detail(it.productId);

      if (dto.paymentMethod === 'points' && p.loyaltyType === 'cash') {
        throw new BadRequestException('This product cannot be bought with points.');
      }
      if ((dto.paymentMethod === 'card' || dto.paymentMethod === 'cod') && p.loyaltyType === 'points') {
        throw new BadRequestException('This product can only be bought with points.');
      }

      const unitPrice =
        p.sale && p.sale.active && p.sale.salePrice > 0 ? p.sale.salePrice : p.price;

      items.push({
        productId: it.productId,
        name: p.name,
        unitPrice,
        quantity: it.quantity,
        selectedSize: it.selectedSize,
        selectedColor: it.selectedColor,
      });

      subtotal += unitPrice * it.quantity;
    }

    const deliveryFee = (cart as any).deliveryFee ?? 15;
    const total = subtotal + deliveryFee;

    // ✅ 3. Handle loyalty points
    if (dto.paymentMethod === 'points' || dto.paymentMethod === 'hybrid') {
      const u = await this.users.findById(user.id);
      const available = u?.loyaltyPoints || 0;
      const needed = Math.ceil(total / 100);

      if (available < needed && dto.paymentMethod === 'points') {
        throw new BadRequestException('Not enough loyalty points.');
      }

      const deduct =
        dto.paymentMethod === 'points' ? needed : Math.min(available, needed);

      await this.userModel.findByIdAndUpdate(user.id, {
        $inc: { loyaltyPoints: -deduct },
      });
    }

    // ✅ 4. Adjust stock & sales
    for (const it of cart.items) {
      await this.products.adjustStockAndSales(it.productId, it.quantity, true);
    }

    // ✅ 5. Create order
    const order = await this.model.create({
      userId: user.id,
      items,
      subtotal,
      discount: 0,
      deliveryFee,
      total,
      paymentMethod: dto.paymentMethod,
      status: 'active',
      address: dto.address,
      paymentInfo: dto.paymentInfo || {},
    });

const created = order.toObject();  // <-- define here first

// 🔹 Fetch all admins & superadmins
const admins = await this.userModel.find({ role: { $in: ['admin', 'superadmin'] } }).lean();
const adminIds = admins.map(a => a._id.toString());

// 🔹 Notify admins about the new order
await this.notifications.orderCreated(created, adminIds);

// ✅ 6. Sold-out notifications
for (const it of created.items) {
  const p = await this.products.detail(String(it.productId));
  if (p.stockQuantity <= 0) {
    await this.notifications.productSoldOut(p, adminIds);
  }
}

    // ✅ 7. Clear cart after order
    await this.cartModel.findByIdAndUpdate(cart._id, { items: [] });

    return created;
  }

  myOrders(userId: string) {
    return this.model.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  recent(days = 4) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.model.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).lean();
  }

  async setStatus(orderId: string, status: 'delivered' | 'completed' | 'canceled') {
    const order = await this.model.findById(orderId);
    if (!order) throw new BadRequestException('Order not found');

    if (status === 'canceled') {
      for (const it of order.items) {
        await this.products.restoreStock(it.productId, it.quantity);
      }
    }

    order.status = status;
    await order.save();
    this.notifications.orderStatusChanged(String(order.userId), order.toObject());

    if (
      (status === 'delivered' || status === 'completed') &&
      (order.paymentMethod === 'cod' || order.paymentMethod === 'card' || order.paymentMethod === 'hybrid')
    ) {
      const earn = Math.floor((order.total - order.deliveryFee) / 100);
      await this.userModel.findByIdAndUpdate(order.userId, {
        $inc: { loyaltyPoints: earn },
      });
    }

    return order.toObject();
  }
}
