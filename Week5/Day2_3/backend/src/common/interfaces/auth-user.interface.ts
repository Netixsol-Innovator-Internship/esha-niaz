export interface AuthUser {
  _id: string
  username: string
  email: string
  bio: string
  profilePicture: string
  followersCount: number
  followingCount: number
  isActive: boolean
}
