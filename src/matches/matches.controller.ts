import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  Next,
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUseTags,
  ApiImplicitParam,
  ApiImplicitQuery
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response, Request, NextFunction } from 'express';
import { IUser } from '../users/user.interface';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiUseTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiImplicitQuery({ name: 'externalId' })
  @ApiImplicitQuery({ name: 'tournamentId', required: false })
  public async index(@Req() req: Request, @Res() res: Response) {
    const user: IUser = res.locals.user;
    const tournamentId = parseInt(req.query.tournamentId);
    res.send(await this.matchesService.list({ user, tournamentId }));
  }
}
