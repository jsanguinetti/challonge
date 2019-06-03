import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUser, IUser, IDbUser } from './user.interface';
import { ChallongeService } from '../challonge/challonge.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly challongeService: ChallongeService,
    ) { }

    async validate(externalId: string): Promise<boolean> {
        const foundUser = await this.userRepository.findOne(externalId);
        if (!foundUser) throw { err: 'Invalid user.' };

        return !!foundUser;
    }

    async create(user: ICreateUser): Promise<IUser> {
        const [userEntity, challongeUser] = await Promise.all([this.findOrCreateUser(user), this.challongeService.findUser(user.challongeUsername)]);
        const avatarUrl = this.challongeService.avatarUrl(challongeUser);
        const updatedUser = this.userRepository.merge(userEntity, {
            challonge_username: challongeUser.challonge_username,
            challonge_id: challongeUser.id,
            challonge_avatar_url: `${avatarUrl}`
        });
        await this.userRepository.save(updatedUser);
        return updatedUser.toJSON();
    }

    private async findOrCreateUser(user: ICreateUser): Promise<User> {
        const existingUser = await this.userRepository.find({ external_id: user.externalId });
        if (existingUser[0]) {
            return existingUser[0];
        } else {
            return this.buildUserEntity(user);
        }
    }

    private buildUserEntity(user: ICreateUser): User {
        return this.userRepository.create({
            external_id: user.externalId,
            external_username: user.externalUsername,
            challonge_username: user.challongeUsername
        });
    }
}
