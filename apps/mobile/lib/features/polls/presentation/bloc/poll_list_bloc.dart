import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:anketa/features/polls/domain/usecases/get_trending_polls_use_case.dart';
import 'poll_list_event.dart';
import 'poll_list_state.dart';

const _pageSize = 10;

class PollListBloc extends Bloc<PollListEvent, PollListState> {
  final GetTrendingPollsUseCase getTrendingPolls;

  PollListBloc({required this.getTrendingPolls})
      : super(const PollListInitial()) {
    on<FetchTrendingPolls>(_onFetchTrending);
    on<FetchNextPage>(_onFetchNextPage);
    on<RefreshPolls>(_onRefresh);
  }

  Future<void> _onFetchTrending(
    FetchTrendingPolls event,
    Emitter<PollListState> emit,
  ) async {
    emit(const PollListLoading());
    try {
      final polls = await getTrendingPolls(
        const GetTrendingParams(page: 1, limit: _pageSize),
      );
      emit(PollListLoaded(
        polls: polls,
        currentPage: 1,
        hasMore: polls.length == _pageSize,
      ));
    } catch (e) {
      emit(PollListError(e.toString()));
    }
  }

  Future<void> _onFetchNextPage(
    FetchNextPage event,
    Emitter<PollListState> emit,
  ) async {
    final current = state;
    if (current is! PollListLoaded || current.isLoadingMore || !current.hasMore) {
      return;
    }
    emit(current.copyWith(isLoadingMore: true));
    try {
      final nextPage = current.currentPage + 1;
      final polls = await getTrendingPolls(
        GetTrendingParams(page: nextPage, limit: _pageSize),
      );
      emit(current.copyWith(
        polls: [...current.polls, ...polls],
        currentPage: nextPage,
        hasMore: polls.length == _pageSize,
        isLoadingMore: false,
      ));
    } catch (e) {
      emit(current.copyWith(isLoadingMore: false));
    }
  }

  Future<void> _onRefresh(
    RefreshPolls event,
    Emitter<PollListState> emit,
  ) async {
    add(const FetchTrendingPolls());
  }
}
