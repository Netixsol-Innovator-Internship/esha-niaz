"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const like_controller_1 = require("./like.controller");
const like_service_1 = require("./like.service");
const like_schema_1 = require("./schemas/like.schema");
const websocket_module_1 = require("../websocket/websocket.module");
const comment_module_1 = require("../comment/comment.module");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
let LikeModule = class LikeModule {
};
exports.LikeModule = LikeModule;
exports.LikeModule = LikeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: like_schema_1.Like.name, schema: like_schema_1.LikeSchema }]),
            websocket_module_1.WebsocketModule,
            comment_module_1.CommentModule,
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [like_controller_1.LikeController],
        providers: [like_service_1.LikeService],
        exports: [like_service_1.LikeService],
    })
], LikeModule);
//# sourceMappingURL=like.module.js.map