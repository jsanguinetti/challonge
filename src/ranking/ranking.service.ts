import { RankingEntry } from './entities/rankingEntry.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRankingEntry } from './ranking.interface';
import { UserWithParticipations } from '../users/UserWithParticipations';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(RankingEntry)
    private readonly rankingEntriesRepository: Repository<RankingEntry>
  ) {}

  public async userCurrentRanking(
    user: UserWithParticipations
  ): Promise<IRankingEntry> {
    const currentRanking = await this.rankingEntriesRepository.findOne(
      { user_id: user.id },
      { order: { ranking_week_id: 'DESC' }, relations: ['user'] }
    );
    return currentRanking && currentRanking.toJSON();
  }

  public async currentRanking(): Promise<IRankingEntry[]> {
    const currentRankingWeek = await this.rankingEntriesRepository.findOne({
      order: { ranking_week_id: 'DESC' }
    });
    const currentRanking = await this.rankingEntriesRepository.find({
      where: {
        ranking_week_id: currentRankingWeek.ranking_week_id
      },
      relations: ['user'],
      order: {
        position: 'ASC'
      }
    });
    return currentRanking.map(entry => entry.toJSON());
  }
}
