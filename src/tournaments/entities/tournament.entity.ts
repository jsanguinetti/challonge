import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

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

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', default: () => 'LOCALTIMESTAMP' })
  public createDate: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_date', default: () => 'LOCALTIMESTAMP' })
  public updateDate: string;

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
