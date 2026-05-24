import 'package:equatable/equatable.dart';
import 'package:anketa/features/polls/domain/entities/option.dart';

abstract class VoteState extends Equatable {
  const VoteState();

  @override
  List<Object?> get props => [];
}

class VoteInitial extends VoteState {
  const VoteInitial();
}

class VoteLoading extends VoteState {
  const VoteLoading();
}

class VoteSuccess extends VoteState {
  final List<Option> updatedOptions;
  const VoteSuccess(this.updatedOptions);

  @override
  List<Object?> get props => [updatedOptions];
}

class VoteError extends VoteState {
  final String message;
  const VoteError(this.message);

  @override
  List<Object?> get props => [message];
}
