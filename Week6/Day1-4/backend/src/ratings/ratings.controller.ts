import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VerifiedGuard } from '../common/guards/verified.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private ratings: RatingsService) {}
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Post()
  create(@GetUser() user: any, @Body() dto: CreateRatingDto) {
    return this.ratings.create(user.id, dto.productId, dto.stars, dto.comment);
  }

  @Get(':productId')
  list(@Param('productId') productId: string) {
    return this.ratings.listForProduct(productId);
  }
}
