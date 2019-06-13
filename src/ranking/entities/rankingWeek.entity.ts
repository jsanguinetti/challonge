import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryColumn,
  Unique,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { RankingEntry } from './rankingEntry.entity';

@Entity('ranking_weeks')
@Unique(['season_number', 'week_number'])
export class RankingWeek {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  public season_number: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  public week_number: number;

  @OneToMany(type => RankingEntry, rankingEntry => rankingEntry.ranking_week, {
    persistence: false
  })
  ranking_entries: RankingEntry[];

  @OneToMany(type => Tournament, tournament => tournament.ranking_week, {
    persistence: false
  })
  tournaments: Tournament[];
}
