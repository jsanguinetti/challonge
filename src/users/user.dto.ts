import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiModelProperty({ required: true, example: '123456789' })
    public readonly externalId: string;
    @ApiModelProperty({ required: true, example: 'jsanguinetti' })
    public readonly externalUsername: string;
    @ApiModelProperty({ required: true, example: 'jsanguinetticds' })
    public readonly challongeUsername: string;
}
