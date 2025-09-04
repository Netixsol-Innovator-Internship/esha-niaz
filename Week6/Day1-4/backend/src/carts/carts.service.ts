import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel('Cart') private model: Model<Cart>,
    private products: ProductsService,
  ) {}

  async getCart(userId: string) {
    let cart = await this.model.findOne({ userId });
    if (!cart) cart = await this.model.create({ userId, items: [] });
    return this.calculate(cart.toObject());
  }

  async addItem(userId: string, productId: string, quantity: number, selectedSize?: string, selectedColor?: string) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be > 0');
    const product = await this.products.detail(productId);
    if (product.stockQuantity < quantity) throw new BadRequestException('Insufficient stock');
    let cart = await this.model.findOne({ userId });
    if (!cart) cart = await this.model.create({ userId, items: [] });
    const idx = cart.items.findIndex(i => String(i.productId) === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ productId: new (Types as any).ObjectId(productId), quantity, selectedSize, selectedColor } as any);
    await cart.save();
    return this.calculate(cart.toObject());
  }

  // async updateItem(userId: string, productId: string, quantity: number, selectedSize?: string, selectedColor?: string) {
  //   let cart = await this.model.findOne({ userId });
  //   if (!cart) throw new BadRequestException('Cart not found');
  //   const idx = cart.items.findIndex(i => String(i.productId) === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
  //   if (idx < 0) throw new BadRequestException('Item not found');
  //   if (quantity <= 0) cart.items.splice(idx, 1);
  //   else cart.items[idx].quantity = quantity;
  //   await cart.save();
  //   return this.calculate(cart.toObject());
  // }


  async incrementItem(userId: string, productId: string, selectedSize?: string, selectedColor?: string) {
  let cart = await this.model.findOne({ userId });
  if (!cart) throw new BadRequestException('Cart not found');
  const idx = cart.items.findIndex(
    i => String(i.productId) === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
  );
  if (idx < 0) throw new BadRequestException('Item not found');
  
  cart.items[idx].quantity += 1;
  await cart.save();
  return this.calculate(cart.toObject());
}

async decrementItem(userId: string, productId: string, selectedSize?: string, selectedColor?: string) {
  let cart = await this.model.findOne({ userId });
  if (!cart) throw new BadRequestException('Cart not found');
  const idx = cart.items.findIndex(
    i => String(i.productId) === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
  );
  if (idx < 0) throw new BadRequestException('Item not found');

  cart.items[idx].quantity -= 1;
  if (cart.items[idx].quantity <= 0) {
    // auto remove item if quantity is 0
    cart.items.splice(idx, 1);
  }
  await cart.save();
  return this.calculate(cart.toObject());
}


  // async removeItem(userId: string, productId: string, selectedSize?: string, selectedColor?: string) {
  //   let cart = await this.model.findOne({ userId });
  //   if (!cart) throw new BadRequestException('Cart not found');
  //   cart.items = cart.items.filter(i => !(String(i.productId) === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor));
  //   await cart.save();
  //   return this.calculate(cart.toObject());
  // }

  async removeItem(userId: string, productId: string) {
  // ✅ Find cart by user
  let cart = await this.model.findOne({ userId });
  if (!cart) throw new BadRequestException('Cart not found');

  // ✅ Remove all items with this productId
  cart.items = cart.items.filter(i => String(i.productId) !== productId);

  // ✅ Save and recalculate totals
  await cart.save();
  return this.calculate(cart.toObject());
}
  private calculate(cart: any) {
    const DELIVERY_FEE = 15;
    const items = cart.items || [];
    const productsService = this.products; // 👈 capture here

    
    // Note: For performance, we could batch fetch products; here we compute sequentially
    const enriched = items.map((i: any) => ({ ...i }));
    let subtotal = 0;
    return {
      _id: cart._id,
      userId: cart.userId,
      items: enriched,
      // async pricing(service = productsService) {
      //   let runningSubtotal = 0;
      //   for (const item of enriched) {
      //     const p = await service.detail(String(item.productId)); // ✅ use service
      //     const price = p.effectivePrice;
      //     runningSubtotal += price * item.quantity;
      //   }
      //   const deliveryFee = DELIVERY_FEE;
      //   const total = runningSubtotal + deliveryFee;
      //   return { subtotal: runningSubtotal, deliveryFee, total };
      // }
      async pricing(service = productsService) {
  let runningSubtotal = 0;
  for (const item of enriched) {
    if (!item.productId) continue; // Skip if productId is missing
    const p = await service.detail(String(item.productId));
    const price = p.effectivePrice;
    runningSubtotal += price * item.quantity;
  }
  const deliveryFee = DELIVERY_FEE;
  const total = runningSubtotal + deliveryFee;
  return { subtotal: runningSubtotal, deliveryFee, total };
}
    } as any;

  }
}
