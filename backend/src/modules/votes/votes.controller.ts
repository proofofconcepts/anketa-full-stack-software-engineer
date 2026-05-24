import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VotesService } from './votes.service';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: CreateVoteDto,
  ) {
    return this.votesService.create(req.user.userId, dto);
  }
}
