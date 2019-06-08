import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Participation } from './entities/participation.entity';
import { ICreateUser, IUser } from './user.interface';
import { ChallongeService } from '../challonge/challonge.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { ITournament } from '../tournaments/tournament.interface';
import { UserWithParticipations } from './UserWithParticipations';
import { IChallongeUser } from '../challonge/challonge.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    private readonly challongeService: ChallongeService,
    private readonly tournamentsService: TournamentsService
  ) {}

  public async findOrCreateParticipation(
    user: UserWithParticipations,
    tournament: ITournament
  ): Promise<Participation> {
    if (user.participations) {
      const participation = user.participations.find(
        p => p.tournament_id === tournament.id
      );
      if (participation) {
        return participation;
      }
    }
    const challongeUser = await this.challongeService.findUser(
      user.challongeUsername,
      tournament.challongeId
    );
    return await this.participationRepository.save({
      user_id: user.id,
      challonge_id: challongeUser.id,
      tournament_id: tournament.id
    });
  }

  public async getUser(id: string): Promise<UserWithParticipations> {
    const user = await this.userRepository.findOne(
      {
        external_id: id
      },
      {
        relations: ['participations']
      }
    );
    if (user) {
      return new UserWithParticipations(user.toJSON(), user.participations);
    }
  }

  public async findOrCreateFromChallongeId(
    challongeId: number,
    tournament: ITournament,
    challongeParticipants: IChallongeUser[]
  ): Promise<UserWithParticipations> {
    const participation = await this.participationRepository.findOne(
      { challonge_id: challongeId, tournament_id: tournament.id },
      { relations: ['user'] }
    );
    const userEntity = participation && participation.user;
    if (userEntity) {
      return new UserWithParticipations(userEntity.toJSON(), [participation]);
    } else {
      const challongeUser = challongeParticipants.find(
        u => u.id === challongeId
      );
      let existingUser = await this.findOrCreateUser(challongeUser);

      const newUser = await this.createFromUserEntityAndChallongeUser(
        existingUser,
        challongeUser,
        tournament
      );
      return new UserWithParticipations(
        newUser.toJSON(),
        newUser.participations
      );
    }
  }

  public async create(userParams: ICreateUser): Promise<IUser> {
    const tournament = await this.tournamentsService.getByIdOrGetLatest(
      userParams.tournamentId
    );
    userParams.tournamentId = tournament.id;
    const [userEntity, challongeUser] = await Promise.all([
      this.findOrCreateUser(userParams),
      this.challongeService.findUser(
        userParams.challongeUsername,
        tournament.challongeId
      )
    ]);
    const newUser = await this.createFromUserEntityAndChallongeUser(
      userEntity,
      challongeUser,
      tournament
    );
    return newUser.toJSON();
  }

  private async createFromUserEntityAndChallongeUser(
    userEntity: User,
    challongeUser: IChallongeUser,
    tournament: ITournament
  ) {
    const avatarUrl = this.challongeService.avatarUrl(challongeUser);
    const participationAttrs = {
      challonge_id: challongeUser.id,
      tournament_id: tournament.id
    };
    return await this.updateUser(
      userEntity,
      {
        external_id: userEntity.external_id,
        challonge_username: challongeUser.challongeUsername,
        challonge_avatar_url: `${avatarUrl}`
      },
      participationAttrs
    );
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
    attributes: Partial<User>,
    participation: Partial<Participation>
  ): Promise<User> {
    const userToBeUpdated = this.userRepository.merge(user, attributes, {
      participations: [participation]
    });
    return await this.userRepository.save(userToBeUpdated);
  }

  // private async findOrCreateParticipation(
  //   participationAttrs: Partial<Participation>
  //     participationAttrs
  //   );
  //       participationAttrs
  //     );
  //   }
  //   return participation;
  // }
}
