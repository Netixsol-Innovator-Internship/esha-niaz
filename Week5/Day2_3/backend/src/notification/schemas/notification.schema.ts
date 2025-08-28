import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { Schema as MongooseSchema } from "mongoose"

export interface NotificationTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type NotificationDocument = Notification & Document & NotificationTimestamps

export enum NotificationType {
  COMMENT = "comment",
  REPLY = "reply",
  LIKE = "like",
  FOLLOW = "follow",
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  recipientId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  senderId: string

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType

  @Prop({ required: true })
  message: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Comment" })
  commentId?: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Comment" })
  parentCommentId?: string

  @Prop({ default: false })
  isRead: boolean

  @Prop({ default: true })
  isActive: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

// Index for better query performance
NotificationSchema.index({ recipientId: 1, createdAt: -1 })
NotificationSchema.index({ recipientId: 1, isRead: 1 })
