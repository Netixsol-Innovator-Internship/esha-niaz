import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { Schema as MongooseSchema } from "mongoose"

export interface LikeTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type LikeDocument = Like & Document & LikeTimestamps

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Comment", required: true })
  commentId: string

  @Prop({ default: true })
  isActive: boolean
}

export const LikeSchema = SchemaFactory.createForClass(Like)

// Create compound index to prevent duplicate likes
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true })
