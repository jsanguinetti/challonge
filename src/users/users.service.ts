import { Injectable, forwardRef, Inject } from '@nestjs/common';
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

interface FindOrCreateFromChallongeIdParams {
  challongeId: number;
  tournament: ITournament;
  challongeParticipants: IChallongeUser[];
}
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    private readonly challongeService: ChallongeService,
    @Inject(forwardRef(() => TournamentsService))
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

  public async getUserByChallongeUsername(
    challongeUsername: string
  ): Promise<UserWithParticipations> {
    const user = await this.userRepository.findOne(
      {
        challonge_username: challongeUsername
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
    params: FindOrCreateFromChallongeIdParams
  ): Promise<UserWithParticipations> {
    const { challongeId, tournament, challongeParticipants } = params;
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

      const newUser = await this.updateAndCreateParticipation(
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
    const tournament = await this.tournamentsService.getByIdOrGetLatest({
      challongeUsername: userParams.challongeUsername,
      tournamentId: userParams.tournamentId
    });
    userParams.tournamentId = tournament.id;
    const [userEntity, challongeUser] = await Promise.all([
      this.findOrCreateUser(userParams),
      this.challongeService.findUser(
        userParams.challongeUsername,
        tournament.challongeId
      )
    ]);
    const newUser = await this.updateAndCreateParticipation(
      userEntity,
      challongeUser,
      tournament
    );
    return newUser.toJSON();
  }

  private async updateAndCreateParticipation(
    userEntity: User,
    challongeUser: IChallongeUser,
    tournament: ITournament
  ) {
    const savedParticipation = await this.participationRepository.save({
      user_id: userEntity.id,
      challonge_id: challongeUser.id,
      tournament_id: tournament.id
    });
    const savedUser = await this.userRepository.save(
      this.userRepository.merge(userEntity, {
        external_id: userEntity.external_id,
        challonge_username: challongeUser.challongeUsername,
        challonge_avatar_url: `${this.challongeService.avatarUrl(
          challongeUser
        )}`
      })
    );
    savedUser.participations = savedUser.participations || [];
    savedUser.participations.push(savedParticipation);

    return savedUser;
  }

  private async findOrCreateUser(createUserParams: ICreateUser): Promise<User> {
    let query = this.userRepository
      .createQueryBuilder()
      .where('challonge_username = :challongeUsername');
    if (createUserParams.externalId) {
      query = query.orWhere('external_id = :externalId');
    }
    const existingUser = await query
      .setParameters({ ...createUserParams })
      .getOne();

    if (existingUser) {
      if (!existingUser.external_id && createUserParams.externalId) {
        existingUser.external_id = createUserParams.externalId;
      }
      return await this.userRepository.save(existingUser);
    } else {
      return await this.userRepository.save(
        this.buildUserEntity(createUserParams)
      );
    }
  }

  private buildUserEntity(user: ICreateUser): User {
    return this.userRepository.create({
      external_id: user.externalId,
      challonge_username: user.challongeUsername
    });
  }
}
