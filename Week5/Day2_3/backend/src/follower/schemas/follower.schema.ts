import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { Schema as MongooseSchema } from "mongoose"

export type FollowerDocument = Follower & Document

@Schema({ timestamps: true })
export class Follower {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  followerId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  followingId: string

  @Prop({ default: true })
  isActive: boolean
}

export const FollowerSchema = SchemaFactory.createForClass(Follower)

// Create compound index to prevent duplicate follows
FollowerSchema.index({ followerId: 1, followingId: 1 }, { unique: true })
