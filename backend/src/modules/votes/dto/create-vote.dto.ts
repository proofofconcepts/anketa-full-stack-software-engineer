import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty()
  @IsString()
  pollId!: string;

  @ApiProperty()
  @IsString()
  optionId!: string;
}
