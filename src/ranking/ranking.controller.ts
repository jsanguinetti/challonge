import { RankingService } from './ranking.service';
import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiImplicitQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserWithParticipations } from '../users/UserWithParticipations';
import { Response } from 'express';

@ApiUseTags('ranking')
@Controller('ranking')
@ApiBearerAuth()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('/current/me')
  @UseGuards(AuthGuard)
  @ApiImplicitQuery({ name: 'externalId' })
  public async currentForMe(@Res() res: Response) {
    const user: UserWithParticipations = res.locals.user;
    res.send(await this.rankingService.userCurrentRanking(user));
  }

  @Get('/history/me')
  @UseGuards(AuthGuard)
  @ApiImplicitQuery({ name: 'externalId' })
  public async historyForMe(@Res() res: Response) {
    const user: UserWithParticipations = res.locals.user;
    res.send(await this.rankingService.userRankingHistory(user));
  }

  @Get('/current')
  public async current() {
    return await this.rankingService.currentRanking();
  }
}
