import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) type: string; // e.g. 'sale', 'order'
  @Prop({ required: true }) message: string;
  @Prop() productId?: string;
  @Prop({ default: false }) read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);