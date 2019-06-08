import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.entity';

@Entity('participations')
export class Participation {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  public user_id: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  public challonge_id: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  public tournament_id: number;

  @ManyToOne(type => User, user => user.participations)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
