import { Module, NestModule, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallongeModule } from '../challonge/challonge.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Participation } from './entities/participation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Participation]),
    forwardRef(() => TournamentsModule),
    ChallongeModule
  ],
  providers: [UsersService, TournamentsService],
  controllers: [],
  exports: [UsersService]
})
export class UsersModule {}
