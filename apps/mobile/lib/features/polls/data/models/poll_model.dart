import 'package:anketa/features/auth/data/models/user_model.dart';
import 'package:anketa/features/polls/domain/entities/option.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';

class OptionModel extends Option {
  const OptionModel({
    required super.id,
    required super.text,
    super.imageUrl,
    super.votes,
    super.percentage,
  });

  factory OptionModel.fromJson(Map<String, dynamic> json) => OptionModel(
        id: json['id'] as String,
        text: json['text'] as String,
        imageUrl: json['imageUrl'] as String?,
        votes: (json['votes'] as int?) ?? 0,
        percentage: ((json['percentage'] as num?) ?? 0).toDouble(),
      );
}

class PollModel extends Poll {
  const PollModel({
    required super.id,
    required super.question,
    super.description,
    super.category,
    super.expiresAt,
    required super.createdAt,
    required super.author,
    required super.options,
    super.totalVotes,
    super.commentsCount,
    super.hasVoted,
    super.userVotedOptionId,
  });

  factory PollModel.fromJson(Map<String, dynamic> json) => PollModel(
        id: json['id'] as String,
        question: json['question'] as String,
        description: json['description'] as String?,
        category: json['category'] as String?,
        expiresAt: json['expiresAt'] != null
            ? DateTime.parse(json['expiresAt'] as String)
            : null,
        createdAt: DateTime.parse(json['createdAt'] as String),
        author: UserModel.fromJson(json['author'] as Map<String, dynamic>),
        options: (json['options'] as List<dynamic>)
            .map((o) => OptionModel.fromJson(o as Map<String, dynamic>))
            .toList(),
        totalVotes: (json['totalVotes'] as int?) ?? 0,
        commentsCount: (json['commentsCount'] as int?) ?? 0,
        hasVoted: (json['hasVoted'] as bool?) ?? false,
        userVotedOptionId: json['userVotedOptionId'] as String?,
      );
}
