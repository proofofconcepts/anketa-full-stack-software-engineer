import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:anketa/features/polls/domain/entities/poll.dart';

class PollCard extends StatelessWidget {
  final Poll poll;
  const PollCard({super.key, required this.poll});

  @override
  Widget build(BuildContext context) {
    final topOption = poll.options.isNotEmpty
        ? poll.options.reduce((a, b) => a.votes > b.votes ? a : b)
        : null;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () => context.push('/polls/${poll.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundImage: poll.author.avatar != null
                        ? NetworkImage(poll.author.avatar!)
                        : null,
                    child: poll.author.avatar == null
                        ? Text(poll.author.username[0].toUpperCase())
                        : null,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '@${poll.author.username}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const Spacer(),
                  if (poll.category != null)
                    Chip(
                      label: Text(poll.category!),
                      padding: EdgeInsets.zero,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  if (poll.isExpired) ...[
                    const SizedBox(width: 4),
                    Chip(
                      label: const Text('Expired'),
                      backgroundColor: Colors.red.shade100,
                      padding: EdgeInsets.zero,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 12),
              Text(
                poll.question,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              if (topOption != null) ...[
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: poll.totalVotes > 0
                      ? topOption.votes / poll.totalVotes
                      : 0,
                  borderRadius: BorderRadius.circular(4),
                ),
                const SizedBox(height: 4),
                Text(
                  topOption.text,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.how_to_vote_outlined,
                      size: 16,
                      color: Theme.of(context).colorScheme.secondary),
                  const SizedBox(width: 4),
                  Text(
                    '${poll.totalVotes} votes',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.comment_outlined,
                      size: 16,
                      color: Theme.of(context).colorScheme.secondary),
                  const SizedBox(width: 4),
                  Text(
                    '${poll.commentsCount} comments',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
