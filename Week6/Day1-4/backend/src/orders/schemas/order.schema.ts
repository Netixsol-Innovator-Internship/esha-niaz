import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: any;

  @Prop({ required: true }) name: string;
  @Prop({ required: true }) unitPrice: number;
  @Prop({ required: true }) quantity: number;
  @Prop() selectedSize?: string;
  @Prop() selectedColor?: string;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: any;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ default: 15 }) deliveryFee: number;
  @Prop({ required: true }) total: number;

  @Prop({ type: String, enum: ['cod','card','points','hybrid'], default: 'cod' })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: ['active','delivered','completed','canceled'],
    default: 'active'
  })
  status: string;

  @Prop({ type: Object }) address: any;
  @Prop({ type: Object }) paymentInfo: any;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
