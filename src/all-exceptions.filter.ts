import bugsnag from '@bugsnag/js';
import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserWithParticipations } from './users/UserWithParticipations';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (process.env.BUGSNAG_API_KEY) {
      this.reportToBugsnag(exception, request, response);
    }

    console.error(exception);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
  reportToBugsnag(exception: unknown, request, response: Response) {
    let metaData: any = {
      env: process.env.NODE_ENV
    };
    let user: UserWithParticipations = response.locals.user;
    if (user) {
      user = Object.assign({}, user);
      delete user.participations;
      metaData.userId = user.id;
      metaData.challongeUsername = user.challongeUsername;
    }
    metaData.url = request.url;
    const bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY);
    bugsnagClient.notify(exception, { metaData, severity: 'error', user });
  }
}
