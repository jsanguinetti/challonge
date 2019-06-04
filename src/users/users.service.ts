import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUser, IUser } from './user.interface';
import { ChallongeService } from '../challonge/challonge.service';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly challongeService: ChallongeService,
        private readonly tournamentsService: TournamentsService,
    ) { }

    async validate(externalId: string): Promise<boolean> {
        const foundUser = await this.userRepository.findOne(externalId);
        if (!foundUser) throw { err: 'Invalid user.' };

        return !!foundUser;
    }

    async create(userParams: ICreateUser): Promise<IUser> {
        const latestTournament = await this.tournamentsService.getLatest();
        const [userEntity, challongeUser] = await Promise.all([
            this.findOrCreateUser(userParams),
            this.challongeService.findUser(userParams.challongeUsername, latestTournament.challongeId)
        ]);
        const avatarUrl = this.challongeService.avatarUrl(challongeUser);
        const updatedUser = await this.updateUser(userEntity, {
            challonge_username: challongeUser.challongeUsername,
            challonge_id: challongeUser.id,
            challonge_avatar_url: `${avatarUrl}`
        });
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

    private async updateUser(user: User, attributes: Partial<User>): Promise<User> {
        const userToBeUpdated = this.userRepository.merge(user, attributes);
        return await this.userRepository.save(userToBeUpdated);
    }
}
