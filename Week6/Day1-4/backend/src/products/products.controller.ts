import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/types/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { UsersService } from '../users/users.service'; // Add this import


cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: "dnnk8tuoo",
  api_key: "622295971611181",
  api_secret: "cDXvt-Ia8KfXL2LUqb9Db1hcjTo",
});
// CLOUDINARY_CLOUD_NAME=dnnk8tuoo
// CLOUDINARY_API_KEY=622295971611181
// CLOUDINARY_API_SECRET=cDXvt-Ia8KfXL2LUqb9Db1hcjTo
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService, private notifications: NotificationsService,
    private usersService: UsersService // Inject here
  ) {}

  @Get()
  list(@Query() query: any) {
    return this.products.list(query);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.products.detail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }

  // @Post(':id/sale')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin, Role.SuperAdmin)
  // async setSale(@Param('id') id: string, @Body() body: { salePrice: number }) {
  //   if (!body?.salePrice) throw new BadRequestException('salePrice is required');
  //   const product = await this.products.setSale(id, body.salePrice);
  //   this.notifications.saleStarted(product);
  //   return product;
  // }

  @Post(':id/sale')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
async setSale(
  @Param('id') id: string,
  @Body() body: { discountPercent: number; startTime: Date; endTime: Date }
) {
  if (!body?.discountPercent || !body?.startTime || !body?.endTime)
    throw new BadRequestException('discountPercent, startTime, and endTime are required');
  const product = await this.products.setSale(
    id,
    body.discountPercent,
    body.startTime,
    body.endTime
  );
  const userIds = await this.usersService.getAllUserIds();
  this.notifications.saleStarted(product, userIds);
  return product;
}


  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
}))
  async upload(@Param('id') id: string, @Body() body: { color: string }, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required.');
    const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'ecommerce/products' }, (err, result) => {
        if (err) return reject(err);
        resolve(result as any);
      });
      stream.end(file.buffer);
    });
    return this.products.addVariantImage(id, body.color, uploaded.secure_url);
  }
}
