import { Module } from '@nestjs/common';
import { ChallongeService } from './challonge.service';
import { ChallongeApiModule } from '../challongeApi/challongeApi.module';
import { ChallongeApiService } from '../challongeApi/challongeApi.service';

@Module({
  imports: [ChallongeApiModule],
  providers: [ChallongeApiService, ChallongeService],
  controllers: [],
  exports: [ChallongeService]
})
export class ChallongeModule { }
