import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export interface UserTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type UserDocument = User & Document & UserTimestamps

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: "" })
  bio: string

  @Prop({ default: "" })
  profilePicture: string

  @Prop({ default: 0 })
  followersCount: number

  @Prop({ default: 0 })
  followingCount: number

  @Prop({ default: true })
  isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
