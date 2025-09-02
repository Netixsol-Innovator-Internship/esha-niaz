import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import passport from "passport";
import * as express from "express";
import { join } from "path"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
// app.use(passport.initialize());
  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })

  // ✅ Serve static files
  app.use("/uploads", express.static(join(process.cwd(), "uploads")));

  // Global validation pipe
  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
  app.useGlobalPipes(validationPipe)

  // Global prefix for all routes
  app.setGlobalPrefix("api")

  const port = process.env.PORT || 5000
  await app.listen(port, '0.0.0.0')
  console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap()
