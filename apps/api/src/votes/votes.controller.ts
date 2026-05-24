import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CastVoteDto } from './dto/cast-vote.dto';
import { VotesService } from './votes.service';

@ApiTags('Votes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('polls')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cast a vote on a poll' })
  castVote(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: CastVoteDto) {
    return this.votesService.castVote(id, user.id, dto);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get vote results for a poll' })
  getResults(@Param('id') id: string) {
    return this.votesService.getResults(id);
  }
}
