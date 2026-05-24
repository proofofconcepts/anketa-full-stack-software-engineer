import { Module } from '@nestjs/common';
import { PollsModule } from '../polls/polls.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PollsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
