import type { UserResponseDto } from "../../user/dto/user-response.dto"
import type { NotificationType } from "../schemas/notification.schema"

export class NotificationResponseDto {
  id: string
  recipient: UserResponseDto
  sender: UserResponseDto
  type: NotificationType
  message: string
  commentId?: string
  parentCommentId?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}
