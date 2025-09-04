import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VerifiedGuard } from '../common/guards/verified.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/types/role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, VerifiedGuard)
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@GetUser() user: any, @Body() dto: CreateOrderDto) {
    return this.orders.create(user, dto);
  }

  @Get('me')
  myOrders(@GetUser() user: any) {
    return this.orders.myOrders(user.id);
  }

  @Get('recent')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  recent() {
    return this.orders.recent(4);
  }

  @Patch(':id/status/:status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  setStatus(@Param('id') id: string, @Param('status') status: 'delivered'|'completed'|'canceled') {
    return this.orders.setStatus(id, status);
  }
}
