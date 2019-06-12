import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Participation } from './participation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public external_id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  public challonge_username: string;

  @Column()
  public challonge_avatar_url: string;

  @OneToMany(type => Participation, participation => participation.user, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  participations: Participation[];

  public toJSON() {
    return {
      id: this.id,
      externalId: this.external_id,
      challongeUsername: this.challonge_username,
      challongeAvatarUrl: this.challonge_avatar_url
    };
  }
}
