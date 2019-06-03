import { Module } from '@nestjs/common';
import { ChallongeApiService } from './challongeApi.service';

@Module({
  imports: [],
  providers: [ChallongeApiService],
  controllers: [],
  exports: [ChallongeApiService]
})
export class ChallongeApiModule { }
