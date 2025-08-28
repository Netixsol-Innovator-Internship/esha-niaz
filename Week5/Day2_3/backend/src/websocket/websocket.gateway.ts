import {
  WebSocketGateway,
  WebSocketServer,
   OnGatewayConnection,
   OnGatewayDisconnect,
} from "@nestjs/websockets"
import { Logger } from "@nestjs/common"
import { Server, Socket } from "socket.io"
import { JwtService } from "@nestjs/jwt"
import  { NotificationService } from "../notification/notification.service"

interface AuthenticatedSocket extends Socket {
  userId?: string
  username?: string
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/",
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(WebsocketGateway.name)
  private userSockets = new Map<string, string>() // userId -> socketId
  private socketUsers = new Map<string, string>() // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake auth
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace("Bearer ", "")

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`)
        client.disconnect()
        return
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token)
      client.userId = payload.sub
      client.username = payload.username

      // Store user-socket mapping
      this.userSockets.set(client.userId, client.id)
      this.socketUsers.set(client.id, client.userId)

      // Join user-specific room
      client.join(`user_${client.userId}`)

      this.logger.log(`User ${client.username} (${client.userId}) connected with socket ${client.id}`)

      // Send connection confirmation
      client.emit("connected", {
        message: "Successfully connected to real-time notifications",
        userId: client.userId,
        username: client.username,
      })

      // Send unread notification count
      const { unreadCount } = await this.notificationService.getUserNotifications(client.userId, 1, 1)
      client.emit("unread_count", { count: unreadCount })
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message)
      client.emit("auth_error", { message: "Authentication failed" })
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.userSockets.delete(client.userId)
      this.socketUsers.delete(client.id)
      this.logger.log(`User ${client.username} (${client.userId}) disconnected`)
    } else {
      this.logger.log(`Client ${client.id} disconnected`)
    }
  }

  handleJoinRoom(client: AuthenticatedSocket, data: { room: string }) {
    if (!client.userId) return

    client.join(data.room)
    this.logger.log(`User ${client.userId} joined room: ${data.room}`)
    client.emit("joined_room", { room: data.room })
  }

  handleLeaveRoom(client: AuthenticatedSocket, data: { room: string }) {
    if (!client.userId) return

    client.leave(data.room)
    this.logger.log(`User ${client.userId} left room: ${data.room}`)
    client.emit("left_room", { room: data.room })
  }

  handlePing(client: AuthenticatedSocket) {
    client.emit("pong", { timestamp: new Date().toISOString() })
  }

  async sendNotificationToUser(userId: string, notification: any) {
    try {
      const socketId = this.userSockets.get(userId)
      if (socketId) {
        this.server.to(`user_${userId}`).emit("notification", {
          ...notification,
          timestamp: new Date().toISOString(),
        })
        this.logger.log(`Notification sent to user ${userId}: ${notification.type}`)

        // Also update unread count
        const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1)
        this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount })
      } else {
        this.logger.warn(`User ${userId} not connected, notification queued`)
      }
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${userId}:`, error.message)
    }
  }

  broadcastNewComment(data: any) {
    try {
      this.server.emit("new_comment", {
        ...data,
        timestamp: new Date().toISOString(),
      })
      this.logger.log(`New comment broadcasted: ${data.commentId}`)
    } catch (error) {
      this.logger.error("Failed to broadcast new comment:", error.message)
    }
  }

  // new broadcast method 



  async sendLikeNotification(userId: string, notification: any) {
    try {
      const socketId = this.userSockets.get(userId)
      if (socketId) {
        this.server.to(`user_${userId}`).emit("like_notification", {
          ...notification,
          timestamp: new Date().toISOString(),
        })
        this.logger.log(`Like notification sent to user ${userId}`)

        // Update unread count
        const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1)
        this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount })
      }
    } catch (error) {
      this.logger.error(`Failed to send like notification to user ${userId}:`, error.message)
    }
  }

  async sendFollowNotification(userId: string, notification: any) {
    try {
      const socketId = this.userSockets.get(userId)
      if (socketId) {
        this.server.to(`user_${userId}`).emit("follow_notification", {
          ...notification,
          timestamp: new Date().toISOString(),
        })
        this.logger.log(`Follow notification sent to user ${userId}`)

        // Update unread count
        const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1)
        this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount })
      }
    } catch (error) {
      this.logger.error(`Failed to send follow notification to user ${userId}:`, error.message)
    }
  }



  getOnlineUsersCount(): number {
    return this.userSockets.size
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId)
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys())
  }

  handleTyping(client: AuthenticatedSocket, data: { room?: string }) {
    if (!client.userId) return

    const room = data.room || "general"
    client.to(room).emit("user_typing", {
      userId: client.userId,
      username: client.username,
      timestamp: new Date().toISOString(),
    })
  }

  handleStopTyping(client: AuthenticatedSocket, data: { room?: string }) {
    if (!client.userId) return

    const room = data.room || "general"
    client.to(room).emit("user_stop_typing", {
      userId: client.userId,
      username: client.username,
      timestamp: new Date().toISOString(),
    })
  }
}
