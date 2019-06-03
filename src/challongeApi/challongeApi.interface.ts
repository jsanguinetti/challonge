export interface ITournamentParticipantsParameters {
  tournamentId: string,
}

export interface ITournamentParticipantResponse {
  participant: ITournamentParticipant
}
export interface ITournamentParticipant {
  id: number,
  tournament_id: number,
  name: string,
  seed: number,
  active: boolean,
  created_at: string,
  updated_at: string,
  ranked_member_id: number,
  challonge_username: string,
  challonge_email_address_verified: boolean,
  removable: boolean,
  participatable_or_invitation_attached: boolean,
  confirm_remove: boolean,
  invitation_pending: boolean,
  display_name_with_invitation_email_address: string,
  email_hash: string,
  username: string,
  display_name: string,
  attached_participatable_portrait_url: string,
  can_check_in: boolean,
  checked_in: boolean,
  reactivatable: boolean,
  check_in_open: boolean,
  group_player_ids: [],
  has_irrelevant_seed: boolean
}
