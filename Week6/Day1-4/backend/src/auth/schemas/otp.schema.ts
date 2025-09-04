import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

export enum OtpPurpose {
  VerifyEmail = 'verify_email',
  ResetPassword = 'reset_password',
}

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true, enum: Object.values(OtpPurpose) })
  purpose: OtpPurpose;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  resendCount: number;

  @Prop({ type: Date, default: null })
  lastSentAt: Date;

  // Added by timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ userId: 1, purpose: 1 });
