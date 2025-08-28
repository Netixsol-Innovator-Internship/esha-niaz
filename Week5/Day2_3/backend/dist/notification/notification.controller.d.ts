import { NotificationService } from "./notification.service";
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(req: any, page?: string, limit?: string): Promise<{
        page: number;
        limit: number;
        notifications: import("./dto/notification-response.dto").NotificationResponseDto[];
        total: number;
        unreadCount: number;
        message: string;
    }>;
    markAsRead(id: string, req: any): Promise<{
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    deleteNotification(id: string, req: any): Promise<{
        message: string;
    }>;
}
