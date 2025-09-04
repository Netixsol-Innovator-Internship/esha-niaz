import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VerifiedGuard } from '../common/guards/verified.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('carts')
@UseGuards(JwtAuthGuard, VerifiedGuard)
export class CartsController {
  constructor(private carts: CartsService) {}

  @Get('me')
  async myCart(@GetUser() user: any) {
    const cart = await this.carts.getCart(user.id);
    const pricing = await (cart as any).pricing();
    return { ...cart, ...pricing };
  }

  @Post('add')
  add(@GetUser() user: any, @Body() body: { productId: string, quantity: number, selectedSize?: string, selectedColor?: string }) {
    return this.carts.addItem(user.id, body.productId, body.quantity, body.selectedSize, body.selectedColor);
  }

  // @Patch('update')
  // update(@GetUser() user: any, @Body() body: { productId: string, quantity: number, selectedSize?: string, selectedColor?: string }) {
  //   return this.carts.updateItem(user.id, body.productId, body.quantity, body.selectedSize, body.selectedColor);
  // }

  @Patch('increment')
increment(@GetUser() user: any, @Body() body: { productId: string, selectedSize?: string, selectedColor?: string }) {
  return this.carts.incrementItem(user.id, body.productId, body.selectedSize, body.selectedColor);
}

@Patch('decrement')
decrement(@GetUser() user: any, @Body() body: { productId: string, selectedSize?: string, selectedColor?: string }) {
  return this.carts.decrementItem(user.id, body.productId, body.selectedSize, body.selectedColor);
}


  // @Delete('remove')
  // remove(@GetUser() user: any, @Query() q: { productId: string, selectedSize?: string, selectedColor?: string }) {
  //   return this.carts.removeItem(user.id, q.productId, q.selectedSize, q.selectedColor);
  // }

  @Delete('remove')
remove(@GetUser() user: any, @Query('productId') productId: string) {
  return this.carts.removeItem(user.id, productId);
}

}
