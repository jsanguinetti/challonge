import { Injectable, Logger } from '@nestjs/common';
import * as API from './challongeApi.interface';
import axios from 'axios';

@Injectable()
export class ChallongeApiService {
  public async tournamentMatches(
    parameters: API.ITournamentMatchesParameters
  ): Promise<API.IParticipantWithMatchesResponse> {
    const url =
      this.baseRequestUrl() +
      this.tournamentsRequestPath(parameters.tournamentId) +
      '/participants/' +
      parameters.participantId +
      '.json?include_matches=1';
    const result = await axios.get(url);
    return result.data;
  }
  public async tournamentParticipants(
    parameters: API.ITournamentParticipantsParameters
  ): Promise<API.ITournamentParticipantResponse[]> {
    const result = await axios.get(
      this.baseRequestUrl() +
        this.tournamentsRequestPath(parameters.tournamentId) +
        '/participants.json'
    );
    return result.data;
  }

  public async tournamentParticipant(
    parameters: API.ITournamentParticipantParameters
  ): Promise<API.ITournamentParticipantResponse> {
    const url =
      this.baseRequestUrl() +
      this.tournamentsRequestPath(parameters.tournamentId) +
      '/participants/' +
      parameters.participantId +
      '.json';
    const result = await axios.get(url);
    return result.data;
  }

  public async tournament(
    tournamentIdAlias: string
  ): Promise<API.ITournamentResponse> {
    const result = await axios.get(
      this.baseRequestUrl() +
        this.tournamentsRequestPath(tournamentIdAlias) +
        '.json'
    );
    return result.data;
  }

  private tournamentsRequestPath(tournamentId: string | number) {
    return `tournaments/${tournamentId}`;
  }

  private baseRequestUrl() {
    return `https://${process.env.CHALLONGE_KEY}@api.challonge.com/v1/`;
  }
}
