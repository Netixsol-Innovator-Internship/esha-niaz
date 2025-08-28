import type { UserResponseDto } from "../../user/dto/user-response.dto"

export class CommentResponseDto {
  id: string
  content: string
  author: UserResponseDto
  parentId: string | null
  likesCount: number
  repliesCount: number
  isEdited: boolean
  editedAt: Date | null
  createdAt: Date
  updatedAt: Date
  replies?: CommentResponseDto[]
  isLikedByUser?: boolean
}
