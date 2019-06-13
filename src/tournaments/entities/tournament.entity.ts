import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { RankingWeek } from '../../ranking/entities/rankingWeek.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  public name: string;

  @Column()
  @IsNotEmpty()
  public challonge_id: number;

  @Column()
  @IsNotEmpty()
  public challonge_id_alias: string;

  @Column()
  @IsNotEmpty()
  public full_challonge_url: string;

  @Column()
  @IsNotEmpty()
  public game_name: string;

  @Column()
  @IsNotEmpty()
  ranking_week_id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  public createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_date' })
  public updateDate: string;

  @ManyToOne(type => RankingWeek, { persistence: false })
  @JoinColumn({ name: 'ranking_week_id' })
  ranking_week: RankingWeek;

  public toJSON() {
    return {
      id: this.id,
      challongeId: this.challonge_id,
      challongeIdAlias: this.challonge_id_alias,
      name: this.name,
      fullChallongeUrl: this.full_challonge_url,
      gameName: this.game_name
    };
  }
}
