import 'package:equatable/equatable.dart';
import 'package:anketa/features/polls/domain/entities/option.dart';
import 'package:anketa/features/vote/domain/repositories/vote_repository.dart';

class CastVoteParams extends Equatable {
  final String pollId;
  final String optionId;
  const CastVoteParams({required this.pollId, required this.optionId});

  @override
  List<Object> get props => [pollId, optionId];
}

class CastVoteUseCase {
  final VoteRepository _repository;
  const CastVoteUseCase(this._repository);

  Future<List<Option>> call(CastVoteParams params) =>
      _repository.castVote(pollId: params.pollId, optionId: params.optionId);
}
