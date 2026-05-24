import 'package:anketa/features/polls/domain/entities/option.dart';
import 'package:anketa/features/vote/domain/repositories/vote_repository.dart';
import '../datasources/vote_remote_data_source.dart';

class VoteRepositoryImpl implements VoteRepository {
  final VoteRemoteDataSource _dataSource;
  const VoteRepositoryImpl(this._dataSource);

  @override
  Future<List<Option>> castVote({
    required String pollId,
    required String optionId,
  }) =>
      _dataSource.castVote(pollId: pollId, optionId: optionId);
}
