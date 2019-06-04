import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiModelProperty({ required: true, example: 'codigodelsur-8a6hscg9' })
  public readonly challongeIdAlias: string;
}

export class UpdateTournamentDto {
  @ApiModelProperty({ required: true, example: 'codigodelsur-8a6hscg9' })
  public readonly challongeIdAlias: string;
}

