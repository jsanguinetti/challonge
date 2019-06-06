import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import {
  ICreateTournament,
  ITournament,
  IUpdateTournament
} from './tournament.interface';
import { ChallongeService } from '../challonge/challonge.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
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
}
