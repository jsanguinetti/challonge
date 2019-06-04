import { Module, NestModule, forwardRef } from '@nestjs/common';
import { Tournament } from './entities/tournament.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallongeModule } from '../challonge/challonge.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    ChallongeModule,
  ],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService]
})
export class TournamentsModule { }
