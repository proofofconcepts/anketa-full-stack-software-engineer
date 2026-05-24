import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/poll_list_bloc.dart';
import '../bloc/poll_list_event.dart';
import '../bloc/poll_list_state.dart';
import '../widgets/poll_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _scrollCtrl = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<PollListBloc>().add(const FetchTrendingPolls());
    _scrollCtrl.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollCtrl.position.pixels >=
        _scrollCtrl.position.maxScrollExtent - 200) {
      context.read<PollListBloc>().add(const FetchNextPage());
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PollListBloc, PollListState>(
      builder: (context, state) {
        if (state is PollListLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (state is PollListError) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(state.message),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: () => context
                      .read<PollListBloc>()
                      .add(const FetchTrendingPolls()),
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }
        if (state is PollListLoaded) {
          return RefreshIndicator(
            onRefresh: () async {
              context.read<PollListBloc>().add(const RefreshPolls());
            },
            child: ListView.builder(
              controller: _scrollCtrl,
              itemCount:
                  state.polls.length + (state.isLoadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == state.polls.length) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }
                return PollCard(poll: state.polls[index]);
              },
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
