export interface PollOption {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  _count?: {
    votes: number;
  };
}

export interface CreateVotePayload {
  pollId: string;
  optionId: string;
}
