import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/types/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' })
  role: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 0 })
  loyaltyPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
