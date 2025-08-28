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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.Notification = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["COMMENT"] = "comment";
    NotificationType["REPLY"] = "reply";
    NotificationType["LIKE"] = "like";
    NotificationType["FOLLOW"] = "follow";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], Notification.prototype, "recipientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], Notification.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: "Comment" }),
    __metadata("design:type", String)
], Notification.prototype, "commentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: "Comment" }),
    __metadata("design:type", String)
], Notification.prototype, "parentCommentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isActive", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ recipientId: 1, createdAt: -1 });
exports.NotificationSchema.index({ recipientId: 1, isRead: 1 });
//# sourceMappingURL=notification.schema.js.map