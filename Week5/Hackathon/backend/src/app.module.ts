import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BidsModule } from './bids/bids.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppGateway } from './gateway/app.gateway';
import { ScheduleModule } from '@nestjs/schedule';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),   
    //  ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'), // uploads folder serve karna
    //   serveRoot: '/uploads', // URL pe access /uploads
    // }),
    AuthModule,
    UsersModule,
    CarsModule,
    BidsModule,
    NotificationsModule,
  ],
  
  providers: [AppGateway],
})
export class AppModule {}
