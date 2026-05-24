import 'package:equatable/equatable.dart';

abstract class VoteEvent extends Equatable {
  const VoteEvent();

  @override
  List<Object> get props => [];
}

class VoteSubmitted extends VoteEvent {
  final String pollId;
  final String optionId;
  const VoteSubmitted({required this.pollId, required this.optionId});

  @override
  List<Object> get props => [pollId, optionId];
}
