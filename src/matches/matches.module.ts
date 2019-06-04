import { Module, NestModule, forwardRef } from '@nestjs/common';
import { ChallongeModule } from '../challonge/challonge.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    ChallongeModule,
    TournamentsModule,
    UsersModule,
    AuthModule
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: []
})
export class MatchesModule { }
