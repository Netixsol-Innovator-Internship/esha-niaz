import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { Schema as MongooseSchema } from "mongoose"

export interface CommentTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type CommentDocument = Comment & Document & CommentTimestamps

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  authorId: string

  @Prop({ required: true, maxlength: 1000 })
  content: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Comment", default: null })
  parentId: string | null

  @Prop({ default: 0 })
  likesCount: number

  @Prop({ default: 0 })
  repliesCount: number

  @Prop({ default: false })
  isEdited: boolean

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: Date })
  editedAt: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

// Index for better query performance
CommentSchema.index({ parentId: 1, createdAt: -1 })
CommentSchema.index({ authorId: 1, createdAt: -1 })
