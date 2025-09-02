import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Car extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  // Seller info
  @Prop({ enum: ['dealer', 'private'], default: 'private' })
  sellerType: 'dealer' | 'private';

  @Prop() sellerFirstName?: string;
  @Prop() sellerLastName?: string;
  @Prop() sellerEmail?: string;
  @Prop() sellerPhone?: string;

  // Car details
  @Prop({ required: true }) vin: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) make: string;
  @Prop({ required: true, alias: 'model' }) carModel: string;
  @Prop() mileage?: number;
  @Prop() engineSize?: string;
  @Prop() paint?: string;
  @Prop({ default: false }) hasGccSpecs?: boolean;
  @Prop() features?: string;
  @Prop({ default: false }) accidentHistory?: boolean;
  @Prop({ default: false }) fullServiceHistory?: boolean;
  @Prop({ enum: ['stock', 'modified'], default: 'stock' })
  modified?: 'stock' | 'modified';

  // Auction
  @Prop({ required: true }) maxBid: number;
  @Prop({ type: [String], default: [] }) photos: string[];
  @Prop() description?: string;

  @Prop() startTime?: Date;
  @Prop() endTime?: Date;
  @Prop({ enum: ['draft', 'live', 'ended'], default: 'draft' })
  status: 'draft' | 'live' | 'ended';

  @Prop({ default: 0 }) currentBid: number;
  @Prop({ type: Types.ObjectId, ref: 'User' }) topBidder?: Types.ObjectId;

    // 🆕 Add this block
  @Prop({
    type: [
      {
        bidder: { type: Types.ObjectId, ref: 'User' },
        amount: { type: Number, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  bids: {
    bidder: Types.ObjectId;
    amount: number;
    time: Date;
  }[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
CarSchema.index({ make: 1, model: 1, year: 1 });
CarSchema.index({ status: 1, endTime: 1 });
