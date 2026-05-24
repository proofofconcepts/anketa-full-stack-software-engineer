import 'package:equatable/equatable.dart';

abstract class PollListEvent extends Equatable {
  const PollListEvent();

  @override
  List<Object> get props => [];
}

class FetchTrendingPolls extends PollListEvent {
  const FetchTrendingPolls();
}

class FetchNextPage extends PollListEvent {
  const FetchNextPage();
}

class RefreshPolls extends PollListEvent {
  const RefreshPolls();
}
