import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:anketa/core/error/failures.dart';
import 'package:anketa/features/vote/domain/usecases/cast_vote_use_case.dart';
import 'vote_event.dart';
import 'vote_state.dart';

class VoteBloc extends Bloc<VoteEvent, VoteState> {
  final CastVoteUseCase castVote;

  VoteBloc({required this.castVote}) : super(const VoteInitial()) {
    on<VoteSubmitted>(_onVoteSubmitted);
  }

  Future<void> _onVoteSubmitted(
    VoteSubmitted event,
    Emitter<VoteState> emit,
  ) async {
    emit(const VoteLoading());
    try {
      final options = await castVote(
        CastVoteParams(pollId: event.pollId, optionId: event.optionId),
      );
      emit(VoteSuccess(options));
    } on Failure catch (f) {
      emit(VoteError(f.message));
    } catch (e) {
      emit(VoteError(e.toString()));
    }
  }
}
