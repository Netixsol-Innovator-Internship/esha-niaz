import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { NotificationService } from "../notification/notification.service";
interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private notificationService;
    server: Server;
    private readonly logger;
    private userSockets;
    private socketUsers;
    constructor(jwtService: JwtService, notificationService: NotificationService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): void;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        room: string;
    }): void;
    handlePing(client: AuthenticatedSocket): void;
    sendNotificationToUser(userId: string, notification: any): Promise<void>;
    broadcastNewComment(data: any): void;
    sendLikeNotification(userId: string, notification: any): Promise<void>;
    sendFollowNotification(userId: string, notification: any): Promise<void>;
    getOnlineUsersCount(): number;
    isUserOnline(userId: string): boolean;
    getOnlineUsers(): string[];
    handleTyping(client: AuthenticatedSocket, data: {
        room?: string;
    }): void;
    handleStopTyping(client: AuthenticatedSocket, data: {
        room?: string;
    }): void;
}
export {};
