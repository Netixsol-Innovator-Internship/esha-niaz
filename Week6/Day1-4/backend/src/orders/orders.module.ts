// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { OrdersService } from './orders.service';
// import { OrdersController } from './orders.controller';
// import { Order, OrderSchema } from './schemas/order.schema';
// import { ProductsModule } from '../products/products.module';
// import { UsersModule } from '../users/users.module';
// import { NotificationsModule } from '../notifications/notifications.module';
// import { User, UserSchema } from '../users/schemas/user.schema';  // <-- import User schema

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
//     ProductsModule,
//     UsersModule,
//     NotificationsModule,
//     { name: User.name, schema: UserSchema },   // <-- register User model here
//   ],
//   controllers: [OrdersController],
//   providers: [OrdersService],
//   exports: [OrdersService],
// })
// export class OrdersModule {}



import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { User, UserSchema } from '../users/schemas/user.schema';  // ✅ import User schema
import { Cart, CartSchema } from '../carts/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },  // ✅ put inside here
      { name: Cart.name, schema: CartSchema },
    ]),
    ProductsModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
