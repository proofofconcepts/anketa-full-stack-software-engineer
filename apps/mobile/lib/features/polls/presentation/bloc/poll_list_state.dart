import 'package:equatable/equatable.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';

abstract class PollListState extends Equatable {
  const PollListState();

  @override
  List<Object?> get props => [];
}

class PollListInitial extends PollListState {
  const PollListInitial();
}

class PollListLoading extends PollListState {
  const PollListLoading();
}

class PollListLoaded extends PollListState {
  final List<Poll> polls;
  final int currentPage;
  final bool hasMore;
  final bool isLoadingMore;

  const PollListLoaded({
    required this.polls,
    required this.currentPage,
    required this.hasMore,
    this.isLoadingMore = false,
  });

  PollListLoaded copyWith({
    List<Poll>? polls,
    int? currentPage,
    bool? hasMore,
    bool? isLoadingMore,
  }) =>
      PollListLoaded(
        polls: polls ?? this.polls,
        currentPage: currentPage ?? this.currentPage,
        hasMore: hasMore ?? this.hasMore,
        isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      );

  @override
  List<Object?> get props => [polls, currentPage, hasMore, isLoadingMore];
}

class PollListError extends PollListState {
  final String message;
  const PollListError(this.message);

  @override
  List<Object?> get props => [message];
}
