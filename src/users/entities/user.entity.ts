import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, QueryFailedError } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public external_id: string;

    @Column()
    public external_username: string;

    @Column()
    @IsNotEmpty()
    public challonge_username: string;

    @Column()
    @IsNotEmpty()
    public challonge_id: number;

    @Column()
    public challonge_avatar_url: string;

    public toJSON() {
        return {
            id: this.id,
            externalId: this.external_id,
            externalUsername: this.external_username,
            challongeUsername: this.challonge_username,
            challongeId: this.challonge_id,
            challongeAvatarUrl: this.challonge_avatar_url
        };
    }
}
