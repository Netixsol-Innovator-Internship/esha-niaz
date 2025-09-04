import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private model: Model<Product>) {}

  async create(data: any) {
    const created = await this.model.create(data);
    return created.toObject();
  }

  async update(id: string, data: any) {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new NotFoundException('Product not found.');
    return updated.toObject();
  }

  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { message: 'Product deleted.' };
  }

async addVariantImage(productId: string, color: string, imageUrl: string) {
  const product = await this.model.findById(productId);
  if (!product) throw new NotFoundException('Product not found');
  const existing = product.variants.find(v => v.color === color);
  if (existing) {
    if (existing.images.length >= 5) {
      throw new BadRequestException('Maximum 5 images allowed per color variant.');
    }
    existing.images.push(imageUrl);
  } else {
    product.variants.push({ color, images: [imageUrl] });
  }
  await product.save();
  return product.toObject();
}
  // async setSale(productId: string, salePrice: number) {
  //   if (salePrice <= 0) throw new BadRequestException('Sale price must be positive.');
  //   const p = await this.model.findByIdAndUpdate(productId, { salePrice }, { new: true });
  //   if (!p) throw new NotFoundException('Product not found');
  //   return p.toObject();
  // }
async setSale(
  productId: string,
  discountPercent: number,
  startTime: Date,
  endTime: Date
) {
  if (discountPercent <= 0 || discountPercent >= 100)
    throw new BadRequestException('Discount percent must be between 1 and 99');
  const product = await this.model.findById(productId);
  if (!product) throw new NotFoundException('Product not found');
  const salePrice = product.price * (1 - discountPercent / 100);
  product.sale = {
    salePrice,
    discountPercent,
    startTime,
    endTime,
    active: true
  };
  await product.save();
  return product.toObject();
}
// ...existing code...
  async list(query: any) {
    const filter: any = {};
    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.style) filter.style = query.style;
    if (query.sale === 'true') filter['sale.salePrice'] = { $gt: 0 };
    if (query.loyaltyType) filter.loyaltyType = query.loyaltyType;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    const products = await this.model.find(filter).lean();
    return products.map(p => ({
      ...p,
      effectivePrice: p.sale && p.sale.active ? p.sale.salePrice : p.price,
      sale: p.sale // show sale info if present
    }));
  }

  async detail(id: string) {
    const p = await this.model.findById(id).lean();
    if (!p) throw new NotFoundException('Product not found');
    return {
      ...p,
      effectivePrice: p.sale && p.sale.active ? p.sale.salePrice : p.price,
      sale: p.sale // show sale info if present
    };
  }
// ...existing code...

  async adjustStockAndSales(productId: string, quantity: number, increaseSales = true) {
    const p = await this.model.findById(productId);
    if (!p) throw new NotFoundException('Product not found');
    if (p.stockQuantity < quantity) throw new BadRequestException('Insufficient stock');
    p.stockQuantity -= quantity;
    if (increaseSales) p.soldCount += quantity;
    await p.save();
    return p.toObject();
  }

  async restoreStock(productId: string, quantity: number) {
    const p = await this.model.findById(productId);
    if (!p) return;
    p.stockQuantity += quantity;
    await p.save();
  }

  async updateAverageRating(productId: string, avg: number) {
    await this.model.findByIdAndUpdate(productId, { averageRating: avg });
  }
}
