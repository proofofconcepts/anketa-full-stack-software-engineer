import 'package:equatable/equatable.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';
import 'option.dart';

class Poll extends Equatable {
  final String id;
  final String question;
  final String? description;
  final String? category;
  final DateTime? expiresAt;
  final DateTime createdAt;
  final User author;
  final List<Option> options;
  final int totalVotes;
  final int commentsCount;
  final bool hasVoted;
  final String? userVotedOptionId;

  const Poll({
    required this.id,
    required this.question,
    this.description,
    this.category,
    this.expiresAt,
    required this.createdAt,
    required this.author,
    required this.options,
    this.totalVotes = 0,
    this.commentsCount = 0,
    this.hasVoted = false,
    this.userVotedOptionId,
  });

  bool get isExpired =>
      expiresAt != null && expiresAt!.isBefore(DateTime.now());

  @override
  List<Object?> get props => [
        id,
        question,
        description,
        category,
        expiresAt,
        createdAt,
        author,
        options,
        totalVotes,
        commentsCount,
        hasVoted,
        userVotedOptionId,
      ];
}
