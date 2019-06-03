import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUser, IUser, IDbUser } from './user.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async validate(externalId: string): Promise<boolean> {
        const foundUser = await this.userRepository.findOne(externalId);
        if (!foundUser) throw { err: 'Invalid user.' };

        return !!foundUser;
    }

    async create(user: ICreateUser): Promise<IUser> {
        const existingUser = await this.userRepository.find({ external_id: user.externalId })
        if (existingUser[0]) {
            return existingUser[0].toJSON();
        } else {
            return await this.userRepository.create(this.buildUserEntity(user)).toJSON();
        }
    }

    private buildUserEntity(user: ICreateUser): IDbUser {
        return {
            external_id: user.externalId,
            external_username: user.externalUsername,
            challonge_username: user.challongeUsername
        }
    }
}
