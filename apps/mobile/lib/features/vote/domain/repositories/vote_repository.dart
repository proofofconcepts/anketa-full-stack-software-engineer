import 'package:anketa/features/polls/domain/entities/option.dart';

abstract class VoteRepository {
  Future<List<Option>> castVote({
    required String pollId,
    required String optionId,
  });
}
