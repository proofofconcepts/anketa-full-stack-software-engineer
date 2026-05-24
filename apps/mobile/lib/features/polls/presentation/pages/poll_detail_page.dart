import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:anketa/core/di/service_locator.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';
import 'package:anketa/features/polls/domain/entities/option.dart';
import 'package:anketa/features/vote/presentation/bloc/vote_bloc.dart';
import 'package:anketa/features/vote/presentation/bloc/vote_event.dart';
import 'package:anketa/features/vote/presentation/bloc/vote_state.dart';

class PollDetailPage extends StatefulWidget {
  final String pollId;
  final Poll poll;

  const PollDetailPage({super.key, required this.pollId, required this.poll});

  @override
  State<PollDetailPage> createState() => _PollDetailPageState();
}

class _PollDetailPageState extends State<PollDetailPage> {
  late Poll _poll;

  @override
  void initState() {
    super.initState();
    _poll = widget.poll;
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => sl<VoteBloc>(),
      child: BlocListener<VoteBloc, VoteState>(
        listener: (context, state) {
          if (state is VoteSuccess) {
            setState(() {
              _poll = Poll(
                id: _poll.id,
                question: _poll.question,
                description: _poll.description,
                category: _poll.category,
                expiresAt: _poll.expiresAt,
                createdAt: _poll.createdAt,
                author: _poll.author,
                options: state.updatedOptions,
                totalVotes: state.updatedOptions.fold(0, (s, o) => s + o.votes),
                commentsCount: _poll.commentsCount,
                hasVoted: true,
              );
            });
          } else if (state is VoteError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        child: Scaffold(
          appBar: AppBar(title: Text(_poll.question)),
          body: _PollDetailBody(poll: _poll),
        ),
      ),
    );
  }
}

class _PollDetailBody extends StatelessWidget {
  final Poll poll;
  const _PollDetailBody({required this.poll});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (poll.description != null) ...[
          Text(poll.description!),
          const SizedBox(height: 16),
        ],
        ...poll.options.map((option) => _OptionTile(
              option: option,
              poll: poll,
            )),
        const SizedBox(height: 8),
        Text(
          '${poll.totalVotes} ${poll.totalVotes == 1 ? 'vote' : 'votes'}',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

class _OptionTile extends StatelessWidget {
  final Option option;
  final Poll poll;
  const _OptionTile({required this.option, required this.poll});

  @override
  Widget build(BuildContext context) {
    final canVote = !poll.hasVoted && !poll.isExpired;
    final isSelected = poll.userVotedOptionId == option.id;

    return BlocBuilder<VoteBloc, VoteState>(
      builder: (context, state) {
        final isLoading = state is VoteLoading;
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: InkWell(
            onTap: canVote && !isLoading
                ? () => context.read<VoteBloc>().add(VoteSubmitted(
                      pollId: poll.id,
                      optionId: option.id,
                    ))
                : null,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: isSelected
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).dividerColor,
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Stack(
                children: [
                  if (poll.hasVoted)
                    FractionallySizedBox(
                      widthFactor: option.percentage / 100,
                      child: Container(
                        height: 56,
                        decoration: BoxDecoration(
                          color: Theme.of(context)
                              .colorScheme
                              .primaryContainer
                              .withValues(alpha: 0.4),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(option.text),
                        if (poll.hasVoted)
                          Text('${option.percentage.toStringAsFixed(1)}%'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
