import 'package:anketa/features/polls/domain/entities/poll.dart';
import 'package:anketa/features/polls/domain/repositories/polls_repository.dart';
import '../datasources/polls_remote_data_source.dart';

class PollsRepositoryImpl implements PollsRepository {
  final PollsRemoteDataSource _dataSource;
  const PollsRepositoryImpl(this._dataSource);

  @override
  Future<List<Poll>> getTrending({int page = 1, int limit = 10}) =>
      _dataSource.getTrending(page: page, limit: limit);

  @override
  Future<List<Poll>> getFollowing({int page = 1, int limit = 10}) =>
      _dataSource.getFollowing(page: page, limit: limit);

  @override
  Future<Poll> getOne(String pollId) => _dataSource.getOne(pollId);

  @override
  Future<Poll> create({
    required String question,
    String? description,
    String? category,
    required List<String> options,
    DateTime? expiresAt,
  }) =>
      _dataSource.create({
        'question': question,
        'description': description,
        'category': category,
        'options': options.map((text) => {'text': text}).toList(),
        'expiresAt': expiresAt?.toIso8601String(),
      });

  @override
  Future<void> delete(String pollId) => _dataSource.delete(pollId);
}
