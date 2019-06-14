import { Module } from '@nestjs/common';
import { RankingEntry } from './entities/rankingEntry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RankingEntry]), AuthModule],
  providers: [RankingService],
  controllers: [RankingController],
  exports: []
})
export class RankingModule {}
