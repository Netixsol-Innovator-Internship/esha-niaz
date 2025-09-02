// import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
// import { CarsService } from './cars.service';
// import { CreateCarDto } from './dto/create-car.dto';
// import { UpdateCarDto } from './dto/update-car.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CurrentUser } from '../common/decorators/user.decorator';
// import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { UseInterceptors, UploadedFiles } from '@nestjs/common';
// import { carImageStorage } from '../common/multer.config';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { memoryStorage } from 'multer';
// @ApiTags('cars')
// @Controller('cars')
// export class CarsController {
//   constructor(private carsService: CarsService,
//     private readonly cloudinary: CloudinaryService,
//   ) {}

//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   @Post()
//   @UseInterceptors(FilesInterceptor('photos', 5, { storage: carImageStorage })) // max 5 images
//   create(
//     @CurrentUser() user: any,
//     @Body() dto: CreateCarDto,
//     @UploadedFiles() files?: Express.Multer.File[],
//   ) {
//     // ✅ Safe handling of undefined files
//     const photoUrls = files?.map(file => `/uploads/cars/${file.filename}`) || [];

//     // ⚠️ Optional strict check: uncomment if you want at least 1 photo required
//     /*
//     if (photoUrls.length === 0) {
//       throw new BadRequestException('At least one photo is required');
//     }
//     */

//     return this.carsService.create(user.userId, { ...dto, photos: photoUrls });
//   }

//   @Get()
//   @ApiQuery({ name: 'make', required: false })
//   @ApiQuery({ name: 'model', required: false })
//   @ApiQuery({ name: 'year', required: false })
//   @ApiQuery({ name: 'minPrice', required: false })
//   @ApiQuery({ name: 'maxPrice', required: false })
//   findAll(@Query() query: any) {
//     return this.carsService.findAll(query);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.carsService.findOne(id);
//   }

//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   @Put(':id')
//   update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateCarDto) {
//     return this.carsService.update(user.userId, id, dto);
//   }

//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   @Post(':id/end')
//   endAuction(@Param('id') id: string) {
//     return this.carsService.endAuction(id);
//   }


  
// }

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vin: { type: 'string' },
        year: { type: 'number' },
        make: { type: 'string' },
        model: { type: 'string' },
        maxBid: { type: 'number' },
        mileage: { type: 'number' },
        engineSize: { type: 'string' },
        paint: { type: 'string' },
        hasGccSpecs: { type: 'boolean' },
        features: { type: 'string' },
        accidentHistory: { type: 'boolean' },
        fullServiceHistory: { type: 'boolean' },
        modified: { type: 'string', enum: ['stock', 'modified'] },
        // maxBid: { type: 'number' },
        description: { type: 'string' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        sellerType: { type: 'string', enum: ['dealer','private'] },
        sellerFirstName: { type: 'string' },
        sellerLastName: { type: 'string' },
        sellerEmail: { type: 'string' },
        sellerPhone: { type: 'string' },
        photos: {
          type: 'array',
          maxItems: 5,
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['vin', 'year', 'make', 'model', 'maxBid'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('photos', 5, {
      storage: memoryStorage(),
      limits: { files: 5, fileSize: 8 * 1024 * 1024 }, // optional size limit
      fileFilter: (req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateCarDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    if (files.length > 5) {
      throw new BadRequestException('You can upload up to 5 images');
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const result = await this.cloudinary.uploadImage(file.buffer, `cars/${user.userId}`);
      uploadedUrls.push(result.secure_url);
    }

    return this.carsService.create(user.userId, { ...dto, photos: uploadedUrls });
  }

    // inside CarsController
@Get('live')
async getLiveCars() {
  return this.carsService.findAllLive();
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('my')
async getMyCars(@CurrentUser() user: any) {
  return this.carsService.findMyCars(user.userId);
}


  // keep your other endpoints as they are...
  @Get()
  @ApiQuery({ name: 'make', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
    // return await this.carsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsService.update(user.userId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/end')
  endAuction(@Param('id') id: string) {
    return this.carsService.endAuction(id);
  }



}
