import 'package:equatable/equatable.dart';

class Option extends Equatable {
  final String id;
  final String text;
  final String? imageUrl;
  final int votes;
  final double percentage;

  const Option({
    required this.id,
    required this.text,
    this.imageUrl,
    this.votes = 0,
    this.percentage = 0,
  });

  @override
  List<Object?> get props => [id, text, imageUrl, votes, percentage];
}
