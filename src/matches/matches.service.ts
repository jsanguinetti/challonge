import { Injectable } from '@nestjs/common';
import { ChallongeService } from '../challonge/challonge.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { IMatch } from './match.interface';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/user.interface';
import { IChallongeMatch } from '../challonge/challonge.interface';
import { ITournament } from '../tournaments/tournament.interface';

interface ListMatchesParams {
  tournamentId?: number;
  user: IUser;
}
type ChallongeMapperFunction = (
  challongeMatch: IChallongeMatch
) => Promise<IMatch>;

@Injectable()
export class MatchesService {
  constructor(
    private readonly challongeService: ChallongeService,
    private readonly tournamentService: TournamentsService,
    private readonly userService: UsersService
  ) {}

  public async list(listMatchesParams: ListMatchesParams): Promise<IMatch[]> {
    const tournament = await this.getTournament(listMatchesParams.tournamentId);
    const { user } = listMatchesParams;
    const challongeMatches = await this.challongeService.getMatches(
      tournament.challongeId,
      user.challongeId
    );
    const matches = await Promise.all(
      challongeMatches.map(this.buildMatch(user, tournament))
    );
    return matches;
  }

  private async getTournament(tournamentId?: number) {
    if (tournamentId) {
      return await this.tournamentService.getTournament(tournamentId);
    } else {
      return await this.tournamentService.getLatest();
    }
  }

  private buildMatch(
    user: IUser,
    tournament: ITournament
  ): ChallongeMapperFunction {
    const usersMap = new Map<Number, IUser>();
    usersMap.set(user.challongeId, user);
    const findUser = async function(id: number): Promise<IUser> {
      const foundUser = usersMap.get(id);
      if (foundUser) {
        return foundUser;
      } else {
        const challongeUser = await this.userService.findOrCreateFromChallongeId(
          id,
          tournament.id
        );
        usersMap.set(id, challongeUser);
        return challongeUser;
      }
    }.bind(this);
    const mapperFunction = async function(challongeMatch: IChallongeMatch) {
      let player1: IUser = null;
      let player2: IUser = null;
      let adversary: IUser = null;
      let winner: IUser = null;
      let loser: IUser = null;

      if (challongeMatch.player1Id == user.challongeId) player1 = user;
      else player1 = await findUser(challongeMatch.player1Id);

      if (challongeMatch.player2Id == user.challongeId) player2 = user;
      else player2 = await findUser(challongeMatch.player2Id);

      adversary = player1.id == user.id ? player2 : player1;
      if (challongeMatch.winnerId == player1.challongeId) winner = player1;
      if (challongeMatch.winnerId == player2.challongeId) winner = player2;
      if (challongeMatch.loserId == player1.challongeId) loser = player1;
      if (challongeMatch.loserId == player2.challongeId) loser = player2;

      const match: IMatch = {
        player1,
        player2,
        winner,
        loser,
        adversary,
        score: challongeMatch.score,
        matchNumber: challongeMatch.suggestedPlayOrder,
        state: challongeMatch.state
      };
      return match;
    };
    return mapperFunction;
  }
}
