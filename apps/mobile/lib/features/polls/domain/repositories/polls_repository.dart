import 'package:anketa/features/polls/domain/entities/poll.dart';

abstract class PollsRepository {
  Future<List<Poll>> getTrending({int page = 1, int limit = 10});
  Future<List<Poll>> getFollowing({int page = 1, int limit = 10});
  Future<Poll> getOne(String pollId);
  Future<Poll> create({
    required String question,
    String? description,
    String? category,
    required List<String> options,
    DateTime? expiresAt,
  });
  Future<void> delete(String pollId);
}
