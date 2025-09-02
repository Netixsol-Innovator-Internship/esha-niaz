import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop() mobileNumber?: string;
  @Prop() nationality?: string;
  @Prop() idType?: string;
  @Prop() idNo?: string;
  @Prop() address1?: string;
  @Prop() address2?: string;
  @Prop() city?: string;
  @Prop() country?: string;
  @Prop() landline?: string;
  @Prop() poBox?: string;

  @Prop() trafficInfoType?: string;
  @Prop() trafficFileNo?: string;
  @Prop() plateState?: string;
  @Prop() plateCode?: string;
  @Prop() plateNumber?: string;
  @Prop() driverLicenseNumber?: string;
  @Prop() issueCity?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  wishlist: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  myCars: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], default: [] })
  myBids: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
