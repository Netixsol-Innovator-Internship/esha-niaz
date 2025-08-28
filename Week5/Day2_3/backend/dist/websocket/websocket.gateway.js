"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const notification_service_1 = require("../notification/notification.service");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    constructor(jwtService, notificationService) {
        this.jwtService = jwtService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(WebsocketGateway_1.name);
        this.userSockets = new Map();
        this.socketUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace("Bearer ", "");
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.userId = payload.sub;
            client.username = payload.username;
            this.userSockets.set(client.userId, client.id);
            this.socketUsers.set(client.id, client.userId);
            client.join(`user_${client.userId}`);
            this.logger.log(`User ${client.username} (${client.userId}) connected with socket ${client.id}`);
            client.emit("connected", {
                message: "Successfully connected to real-time notifications",
                userId: client.userId,
                username: client.username,
            });
            const { unreadCount } = await this.notificationService.getUserNotifications(client.userId, 1, 1);
            client.emit("unread_count", { count: unreadCount });
        }
        catch (error) {
            this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
            client.emit("auth_error", { message: "Authentication failed" });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.userSockets.delete(client.userId);
            this.socketUsers.delete(client.id);
            this.logger.log(`User ${client.username} (${client.userId}) disconnected`);
        }
        else {
            this.logger.log(`Client ${client.id} disconnected`);
        }
    }
    handleJoinRoom(client, data) {
        if (!client.userId)
            return;
        client.join(data.room);
        this.logger.log(`User ${client.userId} joined room: ${data.room}`);
        client.emit("joined_room", { room: data.room });
    }
    handleLeaveRoom(client, data) {
        if (!client.userId)
            return;
        client.leave(data.room);
        this.logger.log(`User ${client.userId} left room: ${data.room}`);
        client.emit("left_room", { room: data.room });
    }
    handlePing(client) {
        client.emit("pong", { timestamp: new Date().toISOString() });
    }
    async sendNotificationToUser(userId, notification) {
        try {
            const socketId = this.userSockets.get(userId);
            if (socketId) {
                this.server.to(`user_${userId}`).emit("notification", {
                    ...notification,
                    timestamp: new Date().toISOString(),
                });
                this.logger.log(`Notification sent to user ${userId}: ${notification.type}`);
                const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1);
                this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount });
            }
            else {
                this.logger.warn(`User ${userId} not connected, notification queued`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send notification to user ${userId}:`, error.message);
        }
    }
    broadcastNewComment(data) {
        try {
            this.server.emit("new_comment", {
                ...data,
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`New comment broadcasted: ${data.commentId}`);
        }
        catch (error) {
            this.logger.error("Failed to broadcast new comment:", error.message);
        }
    }
    async sendLikeNotification(userId, notification) {
        try {
            const socketId = this.userSockets.get(userId);
            if (socketId) {
                this.server.to(`user_${userId}`).emit("like_notification", {
                    ...notification,
                    timestamp: new Date().toISOString(),
                });
                this.logger.log(`Like notification sent to user ${userId}`);
                const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1);
                this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount });
            }
        }
        catch (error) {
            this.logger.error(`Failed to send like notification to user ${userId}:`, error.message);
        }
    }
    async sendFollowNotification(userId, notification) {
        try {
            const socketId = this.userSockets.get(userId);
            if (socketId) {
                this.server.to(`user_${userId}`).emit("follow_notification", {
                    ...notification,
                    timestamp: new Date().toISOString(),
                });
                this.logger.log(`Follow notification sent to user ${userId}`);
                const { unreadCount } = await this.notificationService.getUserNotifications(userId, 1, 1);
                this.server.to(`user_${userId}`).emit("unread_count", { count: unreadCount });
            }
        }
        catch (error) {
            this.logger.error(`Failed to send follow notification to user ${userId}:`, error.message);
        }
    }
    getOnlineUsersCount() {
        return this.userSockets.size;
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
    getOnlineUsers() {
        return Array.from(this.userSockets.keys());
    }
    handleTyping(client, data) {
        if (!client.userId)
            return;
        const room = data.room || "general";
        client.to(room).emit("user_typing", {
            userId: client.userId,
            username: client.username,
            timestamp: new Date().toISOString(),
        });
    }
    handleStopTyping(client, data) {
        if (!client.userId)
            return;
        const room = data.room || "general";
        client.to(room).emit("user_stop_typing", {
            userId: client.userId,
            username: client.username,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
        namespace: "/",
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        notification_service_1.NotificationService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map