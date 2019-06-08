import { Module, NestModule, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallongeModule } from '../challonge/challonge.module';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Participation } from './entities/participation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Participation]),
    TournamentsModule,
    ChallongeModule
  ],
  providers: [UsersService, TournamentsService],
  controllers: [],
  exports: [UsersService]
})
export class UsersModule {}
