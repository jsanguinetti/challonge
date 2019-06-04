import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class GetMatchesDto {
  @ApiModelProperty({ required: true, example: '123456789' })
  public readonly externalId: string;
}
