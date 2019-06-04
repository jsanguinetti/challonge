import * as env from 'dotenv';
import 'reflect-metadata';
import * as logger from 'morgan';
env.config();

import * as bodyParser from 'body-parser';

import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { initDocumentation } from './documentation';
import { EntitiesExceptionFilter } from './http-exception.filter';
import { ApiKeyGlobalGuard } from './api-key.guard';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(ApplicationModule);

    app.use(logger(process.env.NODE_ENV));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.useGlobalFilters(new EntitiesExceptionFilter());
    app.useGlobalGuards(new ApiKeyGlobalGuard);

    initDocumentation(app, {
        version: '1.0.0',
        description: 'Challonge api wrapper',
        title: 'Challonge',
        endpoint: '/docs'
    });

    await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
