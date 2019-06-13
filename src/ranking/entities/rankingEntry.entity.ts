import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryColumn,
  Unique,
  ManyToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { RankingWeek } from './rankingWeek.entity';

@Entity('ranking_entries')
@Unique(['user_id', 'ranking_week_id', 'position'])
export class RankingEntry {
  @Column({ nullable: false })
  @PrimaryColumn()
  public user_id: number;

  @Column({ nullable: false })
  @PrimaryColumn()
  public ranking_week_id: number;

  @Column({ nullable: false })
  public position: number;

  @Column({ nullable: false })
  public points: number;

  @Column({ nullable: false })
  public points_to_defend: number;

  @Column({ nullable: false })
  public won_vs_lost_matches: number;

  @Column({ nullable: false })
  public won_vs_lost_sets: number;

  @Column({ nullable: false })
  public rank_delta: number;

  @ManyToOne(type => User, user => user.ranking_entries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => RankingWeek, rankingWeek => rankingWeek.ranking_entries)
  @JoinColumn({ name: 'ranking_week_id' })
  ranking_week: RankingWeek;
}
