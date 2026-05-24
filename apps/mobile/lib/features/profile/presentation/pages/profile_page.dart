import 'package:flutter/material.dart';
import 'package:anketa/core/di/service_locator.dart';
import 'package:anketa/features/profile/domain/entities/profile.dart';
import 'package:anketa/features/profile/domain/usecases/get_profile_use_case.dart';
import 'package:anketa/features/profile/domain/repositories/profile_repository.dart';

class ProfilePage extends StatefulWidget {
  final String username;
  const ProfilePage({super.key, required this.username});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late Future<Profile> _profileFuture;

  @override
  void initState() {
    super.initState();
    _profileFuture = sl<GetProfileUseCase>().call(widget.username);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('@${widget.username}')),
      body: FutureBuilder<Profile>(
        future: _profileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text(snapshot.error.toString()));
          }
          final profile = snapshot.data!;
          return _ProfileBody(profile: profile);
        },
      ),
    );
  }
}

class _ProfileBody extends StatefulWidget {
  final Profile profile;
  const _ProfileBody({required this.profile});

  @override
  State<_ProfileBody> createState() => _ProfileBodyState();
}

class _ProfileBodyState extends State<_ProfileBody> {
  late bool _isFollowing;
  late int _followersCount;

  @override
  void initState() {
    super.initState();
    _isFollowing = widget.profile.isFollowing;
    _followersCount = widget.profile.followersCount;
  }

  Future<void> _toggleFollow() async {
    final repo = sl<ProfileRepository>();
    if (_isFollowing) {
      await repo.unfollow(widget.profile.id);
      setState(() {
        _isFollowing = false;
        _followersCount--;
      });
    } else {
      await repo.follow(widget.profile.id);
      setState(() {
        _isFollowing = true;
        _followersCount++;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 48,
            backgroundImage: widget.profile.avatar != null
                ? NetworkImage(widget.profile.avatar!)
                : null,
            child: widget.profile.avatar == null
                ? Text(
                    widget.profile.username[0].toUpperCase(),
                    style: const TextStyle(fontSize: 32),
                  )
                : null,
          ),
          const SizedBox(height: 12),
          Text(
            '@${widget.profile.username}',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          if (widget.profile.bio != null) ...[
            const SizedBox(height: 8),
            Text(widget.profile.bio!),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _Stat(label: 'Followers', count: _followersCount),
              const SizedBox(width: 32),
              _Stat(
                  label: 'Following',
                  count: widget.profile.followingCount),
            ],
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _toggleFollow,
            style: _isFollowing
                ? FilledButton.styleFrom(
                    backgroundColor:
                        Theme.of(context).colorScheme.surfaceContainerHighest,
                    foregroundColor:
                        Theme.of(context).colorScheme.onSurface,
                  )
                : null,
            child: Text(_isFollowing ? 'Unfollow' : 'Follow'),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final int count;
  const _Stat({required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          '$count',
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}
