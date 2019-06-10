import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import {
  ICreateTournament,
  ITournament,
  IUpdateTournament
} from './tournament.interface';
import { ChallongeService } from '../challonge/challonge.service';
import { User } from '../users/entities/user.entity';
import { Participation } from '../users/entities/participation.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly challongeService: ChallongeService
  ) {}

  public async list(): Promise<ITournament[]> {
    return (await this.tournamentRepository.find()).map(t => t.toJSON());
  }

  public async create(
    tournamentParams: ICreateTournament
  ): Promise<ITournament> {
    const tournament = await this.createTournament(tournamentParams);
    const createdTournament = await this.tournamentRepository.save(tournament);
    await this.createParticipationsFor(createdTournament);
    return createdTournament.toJSON();
  }
  public async update(
    tournamentParams: IUpdateTournament
  ): Promise<ITournament> {
    const tournament = await this.find(tournamentParams.id);
    const tournamentToUpdate = await this.mergeTournaments(
      tournament,
      tournamentParams.challongeIdAlias
    );
    const updatedTournament = await this.tournamentRepository.save(
      tournamentToUpdate
    );
    await this.createParticipationsFor(updatedTournament);
    return updatedTournament.toJSON();
  }

  public async delete(tournamentId): Promise<boolean> {
    const deleteResult = await this.tournamentRepository.delete({
      id: tournamentId
    });
    return !!deleteResult.affected;
  }

  public async getByIdOrGetLatest(id?: number): Promise<ITournament> {
    if (id) {
      return await this.getTournament(id);
    } else {
      return await this.getLatest();
    }
  }

  public async getTournament(id: number): Promise<ITournament> {
    return (await this.find(id)).toJSON();
  }

  public async getLatest(): Promise<ITournament> {
    const tournament = await this.tournamentRepository.findOneOrFail(null, {
      order: { id: 'DESC' }
    });
    return tournament.toJSON();
  }

  private async find(id: number): Promise<Tournament> {
    const tournaments = await this.tournamentRepository.find({ id });
    return tournaments[0];
  }

  private async createTournament(tournamentParams: ICreateTournament) {
    return this.mergeTournaments(
      this.tournamentRepository.create(),
      tournamentParams.challongeIdAlias
    );
  }

  private async mergeTournaments(
    tournament: Tournament,
    challongeTournamentIdAlias: string
  ) {
    const challongeTournament = await this.challongeService.getTournament(
      challongeTournamentIdAlias
    );
    return this.tournamentRepository.merge(tournament, {
      challonge_id: challongeTournament.id,
      challonge_id_alias: challongeTournamentIdAlias,
      name: challongeTournament.name,
      full_challonge_url: challongeTournament.fullChallongeUrl,
      game_name: challongeTournament.gameName
    });
  }

  private async createParticipationsFor(tournament: Tournament) {
    const participants = await this.challongeService.getTournamentParticipants(
      tournament.challonge_id
    );
    await Promise.all(
      participants.map(
        async p =>
          await this.usersService.findOrCreateFromChallongeId(
            p.id,
            tournament.toJSON(),
            participants
          )
      )
    );
  }
}
