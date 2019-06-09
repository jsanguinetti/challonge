import { Injectable } from '@nestjs/common';
import { ChallongeService } from '../challonge/challonge.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { IMatch } from './match.interface';
import { UsersService } from '../users/users.service';
import { UserWithParticipations } from '../users/UserWithParticipations';
import {
  IChallongeMatch,
  IChallongeUser
} from '../challonge/challonge.interface';
import { ITournament } from '../tournaments/tournament.interface';

interface ListMatchesParams {
  tournamentId?: number;
  user: UserWithParticipations;
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
    const tournament = await this.tournamentService.getByIdOrGetLatest(
      listMatchesParams.tournamentId
    );
    const { user } = listMatchesParams;
    const participation = await this.userService.findOrCreateParticipation(
      user,
      tournament
    );
    const challongeMatches = await this.challongeService.getMatches(
      tournament.challongeId,
      participation.challonge_id
    );
    const challongeParticipants = await this.challongeService.getTournamentParticipants(
      tournament.challongeId
    );
    const matches = await Promise.all(
      challongeMatches
        .filter(m => m.suggestedPlayOrder)
        .map(
          this.buildMatch(
            user,
            tournament,
            participation.challonge_id,
            challongeParticipants,
            this.userService
          )
        )
    );
    return matches;
  }

  private buildMatch(
    user: UserWithParticipations,
    tournament: ITournament,
    challongeId: number,
    challongeParticipants: IChallongeUser[],
    userService: UsersService
  ): ChallongeMapperFunction {
    const usersMap = new Map<Number, UserWithParticipations>();
    usersMap.set(challongeId, user);
    const findUser = async function(
      challongeId: number
    ): Promise<UserWithParticipations> {
      const foundUser = usersMap.get(challongeId);
      if (foundUser) {
        return foundUser;
      } else {
        const userWithParticipations: UserWithParticipations = await userService.findOrCreateFromChallongeId(
          challongeId,
          tournament,
          challongeParticipants
        );
        usersMap.set(challongeId, userWithParticipations);
        return userWithParticipations;
      }
    };
    const mapperFunction = async function(challongeMatch: IChallongeMatch) {
      let player1: UserWithParticipations = null;
      let player2: UserWithParticipations = null;
      let adversary: UserWithParticipations = null;
      let winner: UserWithParticipations = null;
      let loser: UserWithParticipations = null;

      if (challongeMatch.player1Id == challongeId) player1 = user;
      else player1 = await findUser(challongeMatch.player1Id);

      if (challongeMatch.player2Id == challongeId) player2 = user;
      else player2 = await findUser(challongeMatch.player2Id);

      adversary = player1.id == user.id ? player2 : player1;

      if (challongeMatch.winnerId == player1.challongeId(tournament.id))
        winner = player1;
      if (challongeMatch.winnerId == player2.challongeId(tournament.id))
        winner = player2;
      if (challongeMatch.loserId == player1.challongeId(tournament.id))
        loser = player1;
      if (challongeMatch.loserId == player2.challongeId(tournament.id))
        loser = player2;

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
