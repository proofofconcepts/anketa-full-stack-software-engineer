import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePollDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  question!: string;

  @ApiProperty({ type: [String], minItems: 2 })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options!: string[];
}
