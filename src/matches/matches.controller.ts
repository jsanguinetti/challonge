import { Controller, Get, Query, UseGuards, Res, Next } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response, NextFunction } from 'express';
import { IUser } from '../users/user.interface';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiUseTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
  ) { }

  @Get()
  @ApiImplicitQuery({ name: 'externalId' })
  public async index(@Res() res: Response, ) {
    const user: IUser = res.locals.user;
    res.send(await this.matchesService.list({ user }));
  }
}
