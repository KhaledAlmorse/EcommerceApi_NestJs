import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import express from 'express';
import { AppModule } from '../src/app.module';
import { RequestQueryParser } from '../src/Common/Middleware/query-parse.middleware';

const server = express();
let appInitialized = false;

async function bootstrapServer() {
  if (!appInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.use(RequestQueryParser);
    app.enableCors();

    await app.init();
    appInitialized = true;
  }
  return server;
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  server(req, res);
};
