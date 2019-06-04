import { Injectable, Logger } from '@nestjs/common';
import { ITournamentParticipantsParameters, ITournamentParticipantResponse } from './challongeApi.interface';
import axios from 'axios';

@Injectable()
export class ChallongeApiService {

  public async tournamentParticipants(parameters: ITournamentParticipantsParameters): Promise<ITournamentParticipantResponse[]> {
    const result = await axios.get(this.baseRequestUrl() + this.tournamentsRequestPath(parameters.tournamentId) + 'participants.json');
    return result.data;
  }

  private tournamentsRequestPath(tournamentId: string) {
    return `tournaments/${tournamentId}/`;
  }

  private baseRequestUrl() {
    return `https://${process.env.CHALLONGE_KEY}@api.challonge.com/v1/`;
  }
}
