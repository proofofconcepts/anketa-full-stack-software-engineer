import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsService } from './polls.service';

@ApiTags('Polls')
@ApiBearerAuth()
@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get trending polls' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  findTrending(
    @CurrentUser() user: User | null,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('category') category?: string,
  ) {
    return this.pollsService.findTrending({
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      category,
      requesterId: user?.id ?? '',
    });
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get polls from followed users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findFollowing(
    @CurrentUser() user: User,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.pollsService.findFollowing({
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      requesterId: user.id,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new poll' })
  create(@CurrentUser() user: User, @Body() dto: CreatePollDto) {
    return this.pollsService.create(user, dto);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get a poll by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User | null) {
    return this.pollsService.findOne(id, user?.id ?? '');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a poll (author only)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pollsService.remove(id, user.id);
  }
}
