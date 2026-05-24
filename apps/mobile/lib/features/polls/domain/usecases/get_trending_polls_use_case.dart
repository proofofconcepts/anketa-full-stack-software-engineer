import 'package:equatable/equatable.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';
import 'package:anketa/features/polls/domain/repositories/polls_repository.dart';

class GetTrendingParams extends Equatable {
  final int page;
  final int limit;
  const GetTrendingParams({this.page = 1, this.limit = 10});

  @override
  List<Object> get props => [page, limit];
}

class GetTrendingPollsUseCase {
  final PollsRepository _repository;
  const GetTrendingPollsUseCase(this._repository);

  Future<List<Poll>> call(GetTrendingParams params) =>
      _repository.getTrending(page: params.page, limit: params.limit);
}
