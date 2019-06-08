import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserWithParticipations } from '../users/UserWithParticipations';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    return this.userExists(context).then(res => {
      if (res) {
        return res;
      } else {
        throw new UnauthorizedException('User doesnt exist. Log in first');
      }
    });
  }

  private async userExists(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const userId = req.query['externalId'];

    if (!userId) throw new UnauthorizedException('Must provide externalId');

    const res: Response = context.switchToHttp().getResponse();
    res.locals.user = await this.usersService.getUser(userId);

    if (!res.locals.user)
      throw new UnauthorizedException('User doesnt exist. Log in first');

    return !!res.locals.user;
  }
}
