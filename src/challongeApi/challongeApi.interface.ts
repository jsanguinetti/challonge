export interface ITournamentParticipantsParameters {
  tournamentId: string | number;
}

export interface ITournamentParticipantParameters {
  participantId: number;
  tournamentId: string | number;
}

export interface ITournamentMatchesParameters {
  tournamentId: string | number;
  participantId: number;
}

export interface ITournamentParticipantResponse {
  participant: ITournamentParticipant;
}
export interface ITournamentParticipant {
  id: number;
  tournament_id: number;
  name: string;
  seed: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  ranked_member_id: number;
  challonge_username: string;
  challonge_email_address_verified: boolean;
  removable: boolean;
  participatable_or_invitation_attached: boolean;
  confirm_remove: boolean;
  invitation_pending: boolean;
  display_name_with_invitation_email_address: string;
  email_hash: string;
  username: string;
  display_name: string;
  attached_participatable_portrait_url: string;
  can_check_in: boolean;
  checked_in: boolean;
  reactivatable: boolean;
  check_in_open: boolean;
  group_player_ids: [];
  has_irrelevant_seed: boolean;
}

export interface ITournamentResponse {
  tournament: ITournament;
}

export interface ITournament {
  id: number;
  full_challonge_url: string;
  game_name: string;
  name: string;
}

export interface IParticipantWithMatchesResponse {
  participant: IParticipantWithMatches;
}
export interface IParticipantWithMatches extends ITournamentParticipant {
  matches: IMatchResponse[];
}

export interface IMatchResponse {
  match: IMatch;
}
export interface IMatch {
  readonly id: number;
  readonly state: 'complete' | 'open';
  readonly player1_id: number;
  readonly player2_id: number;
  readonly scores_csv: string;
  readonly winner_id: number;
  readonly loser_id: number;
  readonly suggested_play_order: number;
}
