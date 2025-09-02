import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification extends Document {
  @Prop({ enum: ['Start', 'End', 'Win', 'New'], required: true })
  type: 'Start' | 'End' | 'Win' | 'New';

  @Prop({ type: Types.ObjectId, ref: 'User' }) sender?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) receiver: Types.ObjectId;

  @Prop({ default: false }) read: boolean;

  @Prop() comment?: string;

  @Prop({ type: Types.ObjectId, ref: 'Car' }) car?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bid' }) bid?: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ receiver: 1, createdAt: -1 });
