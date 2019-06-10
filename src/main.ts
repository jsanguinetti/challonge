if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEW_RELIC_LICENSE_KEY
) {
  require('newrelic');
}
import * as env from 'dotenv';
import 'reflect-metadata';
import * as logger from 'morgan';
env.config();

import * as bodyParser from 'body-parser';

import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { initDocumentation } from './documentation';
import {
  QueryFailedErrorExceptionFilter,
  SomethingNotFoundErrorExceptionFilter
} from './http-exception.filter';
import { ApiKeyGlobalGuard } from './api-key.guard';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule
  );

  app.use(logger(process.env.NODE_ENV));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new QueryFailedErrorExceptionFilter());
  app.useGlobalFilters(new SomethingNotFoundErrorExceptionFilter());
  app.useGlobalGuards(new ApiKeyGlobalGuard());

  initDocumentation(app, {
    version: '1.0.0',
    description: 'Challonge api wrapper',
    title: 'Challonge',
    endpoint: '/docs'
  });

  await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
