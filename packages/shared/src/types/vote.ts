import type { OptionDto } from './poll';

export interface CastVoteDto {
  optionId: string;
}

export interface VoteResultsDto {
  pollId: string;
  totalVotes: number;
  options: OptionDto[];
}
