import 'package:equatable/equatable.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';
import 'package:anketa/features/polls/domain/repositories/polls_repository.dart';

class CreatePollParams extends Equatable {
  final String question;
  final String? description;
  final String? category;
  final List<String> options;
  final DateTime? expiresAt;

  const CreatePollParams({
    required this.question,
    this.description,
    this.category,
    required this.options,
    this.expiresAt,
  });

  @override
  List<Object?> get props =>
      [question, description, category, options, expiresAt];
}

class CreatePollUseCase {
  final PollsRepository _repository;
  const CreatePollUseCase(this._repository);

  Future<Poll> call(CreatePollParams params) => _repository.create(
        question: params.question,
        description: params.description,
        category: params.category,
        options: params.options,
        expiresAt: params.expiresAt,
      );
}
