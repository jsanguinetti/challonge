import { Controller, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { CreateTournamentDto, UpdateTournamentDto } from './tournament.dto';
import { TournamentsService } from './tournaments.service';

@ApiUseTags('tournaments')
@Controller('tournaments')
@ApiBearerAuth()
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
  ) { }

  @Post()
  public async create(@Body() body: CreateTournamentDto) {
    return this.tournamentsService.create(body);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id' })
  public async put(@Param('id') id, @Body() body: UpdateTournamentDto) {
    return this.update(id, body);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id' })
  public async patch(@Param('id') id, @Body() body: UpdateTournamentDto) {
    return this.update(id, body);
  }

  @Delete(':id')
  @ApiImplicitParam({ name: 'id' })
  public async delete(@Param('id') id) {
    return this.tournamentsService.delete(id);
  }

  private async update(id: number, body: UpdateTournamentDto) {
    return this.tournamentsService.update({ id, ...body });
  }
}
