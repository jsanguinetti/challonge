import { Module, NestModule, forwardRef } from '@nestjs/common';
import { Tournament } from './entities/tournament.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallongeModule } from '../challonge/challonge.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    ChallongeModule
  ],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService]
})
export class TournamentsModule {}
