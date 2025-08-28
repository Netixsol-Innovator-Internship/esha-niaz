// import { Controller, Get, Put, Delete, Param, Query, UseGuards } from "@nestjs/common"
// import type { NotificationService } from "./notification.service"
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
// import { AuthUser } from "../common/interfaces/auth-user.interface"

// @Controller("notifications")
// @UseGuards(JwtAuthGuard)
// export class NotificationController {
//   constructor(private notificationService: NotificationService) {}

//   @Get()
//   async getUserNotifications(user: AuthUser, @Query("page") page: string = "1", @Query("limit") limit: string = "20") {
//     const pageNum = Number.parseInt(page, 10)
//     const limitNum = Number.parseInt(limit, 10)

//     const result = await this.notificationService.getUserNotifications(user._id, pageNum, limitNum)
//     return {
//       message: "Notifications retrieved successfully",
//       ...result,
//       page: pageNum,
//       limit: limitNum,
//     }
//   }

//   @Put(":id/read")
//   async markAsRead(@Param("id") id: string, user: AuthUser) {
//     await this.notificationService.markAsRead(id, user._id)
//     return {
//       message: "Notification marked as read",
//     }
//   }

//   @Put("read-all")
//   async markAllAsRead(user: AuthUser) {
//     return this.notificationService.markAllAsRead(user._id)
//   }

//   @Delete(":id")
//   async deleteNotification(@Param("id") id: string, user: AuthUser) {
//     return this.notificationService.deleteNotification(id, user._id)
//   }
// }




import { Controller, Get, Put, Delete, Param, Query, UseGuards, Req } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { NotificationService } from "./notification.service"

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Req() req,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "20"
  ) {
    const pageNum = Number.parseInt(page, 10)
    const limitNum = Number.parseInt(limit, 10)

    const result = await this.notificationService.getUserNotifications(req.user._id, pageNum, limitNum)
    return {
      message: "Notifications retrieved successfully",
      ...result,
      page: pageNum,
      limit: limitNum,
    }
  }

  @Put(":id/read")
  async markAsRead(@Param("id") id: string, @Req() req) {
    await this.notificationService.markAsRead(id, req.user._id)
    return { message: "Notification marked as read" }
  }

  @Put("read-all")
  async markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user._id)
  }

  @Delete(":id")
  async deleteNotification(@Param("id") id: string, @Req() req) {
    return this.notificationService.deleteNotification(id, req.user._id)
  }
}
