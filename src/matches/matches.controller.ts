import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiImplicitQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response, Request } from 'express';
import { UserWithParticipations } from '../users/UserWithParticipations';

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
    const user: UserWithParticipations = res.locals.user;
    const tournamentId = parseInt(req.query.tournamentId);
    res.send(await this.matchesService.list({ user, tournamentId }));
  }
}
