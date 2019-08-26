import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGlobalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return this.apiKey() == this.requestApiKey(context);
  }

  private apiKey() {
    return process.env.API_KEY;
  }

  private requestApiKey(context: ExecutionContext): string {
    const req: Request = context.switchToHttp().getRequest();
    const apiKeyHeaderValue = req.headers.api_key || req.headers['api-key']
    if (apiKeyHeaderValue)
      return apiKeyHeaderValue as string;
    else {
      return '';
    }
  }
}
