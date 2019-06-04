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
    if (req.headers.api_key)
      return req.headers.api_key as string;
    else {
      return '';
    }
  }
}
