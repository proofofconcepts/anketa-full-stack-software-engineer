import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';
import 'package:anketa/features/polls/domain/usecases/get_trending_polls_use_case.dart';
import 'package:anketa/features/polls/presentation/bloc/poll_list_bloc.dart';
import 'package:anketa/features/polls/presentation/bloc/poll_list_event.dart';
import 'package:anketa/features/polls/presentation/bloc/poll_list_state.dart';

class MockGetTrendingPolls extends Mock implements GetTrendingPollsUseCase {}

const _author = User(id: '1', email: 'a@a.com', username: 'author');

List<Poll> _makePolls(int count) => List.generate(
      count,
      (i) => Poll(
        id: '$i',
        question: 'Question $i',
        createdAt: DateTime.now(),
        author: _author,
        options: const [],
      ),
    );

void main() {
  late MockGetTrendingPolls mockGetTrending;

  setUpAll(() {
    registerFallbackValue(const GetTrendingParams());
  });

  setUp(() {
    mockGetTrending = MockGetTrendingPolls();
  });

  PollListBloc buildBloc() =>
      PollListBloc(getTrendingPolls: mockGetTrending);

  group('PollListBloc', () {
    blocTest<PollListBloc, PollListState>(
      'emits [PollListLoading, PollListLoaded] on FetchTrendingPolls success',
      build: buildBloc,
      setUp: () {
        when(() => mockGetTrending(any()))
            .thenAnswer((_) async => _makePolls(5));
      },
      act: (bloc) => bloc.add(const FetchTrendingPolls()),
      expect: () => [
        const PollListLoading(),
        isA<PollListLoaded>()
            .having((s) => s.polls.length, 'count', 5)
            .having((s) => s.currentPage, 'page', 1)
            .having((s) => s.hasMore, 'hasMore', false),
      ],
    );

    blocTest<PollListBloc, PollListState>(
      'emits PollListError on fetch failure',
      build: buildBloc,
      setUp: () {
        when(() => mockGetTrending(any()))
            .thenThrow(Exception('network error'));
      },
      act: (bloc) => bloc.add(const FetchTrendingPolls()),
      expect: () => [
        const PollListLoading(),
        isA<PollListError>(),
      ],
    );

    blocTest<PollListBloc, PollListState>(
      'appends polls on FetchNextPage',
      build: buildBloc,
      setUp: () {
        when(() => mockGetTrending(any())).thenAnswer((_) async => _makePolls(10));
      },
      seed: () => PollListLoaded(
        polls: _makePolls(10),
        currentPage: 1,
        hasMore: true,
      ),
      act: (bloc) => bloc.add(const FetchNextPage()),
      expect: () => [
        isA<PollListLoaded>().having((s) => s.isLoadingMore, 'loading', true),
        isA<PollListLoaded>()
            .having((s) => s.polls.length, 'total', 20)
            .having((s) => s.currentPage, 'page', 2),
      ],
    );
  });
}
