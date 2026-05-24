import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { PollsService } from '../polls/polls.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private pollsService: PollsService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get authenticated user profile' })
  getMe(@CurrentUser() user: User) {
    return this.usersService.getMe(user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update authenticated user profile' })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user, dto);
  }

  @Get(':username')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile by username' })
  findByUsername(
    @Param('username') username: string,
    @CurrentUser() user: User | null,
  ) {
    return this.usersService.findByUsername(username, user?.id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Follow a user' })
  follow(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.follow(user.id, id);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.unfollow(user.id, id);
  }

  @Get(':username/polls')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get polls created by a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUserPolls(
    @Param('username') username: string,
    @CurrentUser() user: User | null,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.pollsService.findByUsername(
      username,
      parseInt(page),
      Math.min(parseInt(limit), 50),
      user?.id ?? '',
    );
  }
}
