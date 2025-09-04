import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) price: number;
  @Prop({ type: String, enum: ['jeans','shirts','tshirts','hoodies','shorts'], required: true })
  type: string;

  @Prop({ default: 0 }) stockQuantity: number;
  @Prop({ default: 0 }) soldCount: number;

  // @Prop() salePrice?: number;
  @Prop({
  type: {
    salePrice: Number,
    discountPercent: Number,
    startTime: Date,
    endTime: Date,
    active: Boolean
  },
  default: null
})
sale?: {
  salePrice: number;
  discountPercent: number;
  startTime: Date;
  endTime: Date;
  active: boolean;
};

  @Prop({ type: String, enum: ['male','female'], required: true })
  category: string;

  @Prop({ type: String, enum: ['casual','formal','party','gym'], required: true })
  style: string;

  @Prop({ type: [String], default: [] })
  sizes: string[]; // xsmall, small, medium, large, xlarge, xxlarge, 2x, 3x

  @Prop({
    type: [{
      color: String,
      images: [String]
    }], default: []
  })
  variants: { color: string; images: string[] }[];

  @Prop({ type: String, enum: ['cash','points','hybrid'], default: 'cash' })
  loyaltyType: string;

  @Prop() pointsPrice?: number;

  @Prop({ default: 0 })
  averageRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
