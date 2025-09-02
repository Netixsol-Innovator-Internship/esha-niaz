import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateBidDto } from './dto/create-bid.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('bids')
@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBidDto) {
    return this.bidsService.create(user.userId, dto.carId, dto.amount);
  }

  @Get('car/:carId')
  listForCar(@Param('carId') carId: string) {
    return this.bidsService.listForCar(carId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  myBids(@CurrentUser() user: any) {
    return this.bidsService.listForUser(user.userId);
  }
}
