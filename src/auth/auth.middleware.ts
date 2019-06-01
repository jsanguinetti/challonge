import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class IsAuthenticated implements NestMiddleware {
    constructor(private authService: AuthService) { }

    public use(req: Request, _res: Response, next: NextFunction) {

        if (process.env.API_KEY != req.headers['api_key']) {

        } else {
            next();
        }
    }

}
