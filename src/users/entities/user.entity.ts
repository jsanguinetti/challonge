import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, QueryFailedError } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { IUser, IDbUser } from '../user.interface'

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsNotEmpty()
    public external_id: string;

    @Column()
    public external_username: string;

    @Column()
    @IsNotEmpty()
    public challonge_username: string;

    @Column()
    @IsNotEmpty()
    public challonge_id: string;

    @Column()
    public challonge_avatar_url: string;

    public toJSON() {
        return {
            externalId: this.external_id,
            externalUsername: this.external_username,
            challongeUsername: this.challonge_username,
            challongeAvatarUrl: this.challonge_avatar_url
        }
    }
}
