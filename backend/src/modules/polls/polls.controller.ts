import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsService } from './polls.service';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  list() {
    return this.pollsService.list();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request & { user: { userId: string } }, @Body() dto: CreatePollDto) {
    return this.pollsService.create(req.user.userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':pollId')
  delete(@Req() req: Request & { user: { userId: string } }, @Param('pollId') pollId: string) {
    return this.pollsService.remove(req.user.userId, pollId);
  }
}
