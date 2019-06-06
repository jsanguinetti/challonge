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
    private readonly tournamentsService: TournamentsService
  ) {}

  public async getUser(id: string): Promise<IUser> {
    const users = await this.userRepository.find({ external_id: id });
    return users[0] && users[0].toJSON();
  }

  public async findOrCreateFromChallongeId(
    challongeId: number,
    tournamentId?: number
  ): Promise<IUser> {
    const tournament = await this.tournamentsService.getByIdOrGetLatest(
      tournamentId
    );
    const [userEntity, challongeUser] = await Promise.all([
      this.userRepository.findOne({ challonge_id: challongeId }),
      this.challongeService.findUserById(challongeId, tournament.challongeId)
    ]);
    if (userEntity) {
      return userEntity.toJSON();
    } else {
      const newUser = this.userRepository.create({
        challonge_avatar_url: challongeUser.attachedParticipatablePortraitUrl,
        challonge_id: challongeUser.id,
        challonge_username: challongeUser.challongeUsername
      });
      return (await this.userRepository.save(newUser)).toJSON();
    }
  }

  public async create(userParams: ICreateUser): Promise<IUser> {
    const tournament = await this.tournamentsService.getByIdOrGetLatest(
      userParams.tournamentId
    );
    const [userEntity, challongeUser] = await Promise.all([
      this.findOrCreateUser(userParams),
      this.challongeService.findUser(
        userParams.challongeUsername,
        tournament.challongeId
      )
    ]);
    const avatarUrl = this.challongeService.avatarUrl(challongeUser);
    const updatedUser = await this.updateUser(userEntity, {
      external_id: userParams.externalId,
      challonge_username: challongeUser.challongeUsername,
      challonge_id: challongeUser.id,
      challonge_avatar_url: `${avatarUrl}`
    });
    return updatedUser.toJSON();
  }

  private async findOrCreateUser(user: ICreateUser): Promise<User> {
    let query = this.userRepository
      .createQueryBuilder()
      .where('challonge_username = :challongeUsername');
    if (user.externalId) {
      query = query.orWhere('external_id = :externalId');
    }
    const existingUser = await query.setParameters({ ...user }).getOne();

    if (existingUser) {
      return existingUser;
    } else {
      return this.buildUserEntity(user);
    }
  }

  private buildUserEntity(user: ICreateUser): User {
    return this.userRepository.create({
      external_id: user.externalId,
      challonge_username: user.challongeUsername
    });
  }

  private async updateUser(
    user: User,
    attributes: Partial<User>
  ): Promise<User> {
    const userToBeUpdated = this.userRepository.merge(user, attributes);
    return await this.userRepository.save(userToBeUpdated);
  }
}
