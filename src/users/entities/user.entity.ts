import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, QueryFailedError } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsNotEmpty()
    public external_user_id: string;

    @Column()
    public external_username: string;

    @Column()
    @IsNotEmpty()
    public challonge_username: string;

    public toJSON() {
        return {
            external_user_id: this.external_user_id,
            external_username: this.external_username,
            challonge_username: this.challonge_username
        }
    }
}
