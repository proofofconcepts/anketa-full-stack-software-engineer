import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../network/dio_client.dart';
import '../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_use_case.dart';
import '../../features/auth/domain/usecases/register_use_case.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/polls/data/datasources/polls_remote_data_source.dart';
import '../../features/polls/data/repositories/polls_repository_impl.dart';
import '../../features/polls/domain/repositories/polls_repository.dart';
import '../../features/polls/domain/usecases/get_trending_polls_use_case.dart';
import '../../features/polls/domain/usecases/create_poll_use_case.dart';
import '../../features/polls/presentation/bloc/poll_list_bloc.dart';
import '../../features/vote/data/datasources/vote_remote_data_source.dart';
import '../../features/vote/data/repositories/vote_repository_impl.dart';
import '../../features/vote/domain/repositories/vote_repository.dart';
import '../../features/vote/domain/usecases/cast_vote_use_case.dart';
import '../../features/vote/presentation/bloc/vote_bloc.dart';
import '../../features/profile/data/datasources/profile_remote_data_source.dart';
import '../../features/profile/data/repositories/profile_repository_impl.dart';
import '../../features/profile/domain/repositories/profile_repository.dart';
import '../../features/profile/domain/usecases/get_profile_use_case.dart';

final sl = GetIt.instance;

Future<void> setupServiceLocator() async {
  // External
  final prefs = await SharedPreferences.getInstance();
  sl.registerSingleton<SharedPreferences>(prefs);
  sl.registerSingleton<DioClient>(DioClient(prefs));

  // Auth
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl<DioClient>().dio),
  );
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerFactory(() => AuthBloc(login: sl(), register: sl()));

  // Polls
  sl.registerLazySingleton<PollsRemoteDataSource>(
    () => PollsRemoteDataSourceImpl(sl<DioClient>().dio),
  );
  sl.registerLazySingleton<PollsRepository>(
    () => PollsRepositoryImpl(sl()),
  );
  sl.registerLazySingleton(() => GetTrendingPollsUseCase(sl()));
  sl.registerLazySingleton(() => CreatePollUseCase(sl()));
  sl.registerFactory(() => PollListBloc(getTrendingPolls: sl()));

  // Vote
  sl.registerLazySingleton<VoteRemoteDataSource>(
    () => VoteRemoteDataSourceImpl(sl<DioClient>().dio),
  );
  sl.registerLazySingleton<VoteRepository>(
    () => VoteRepositoryImpl(sl()),
  );
  sl.registerLazySingleton(() => CastVoteUseCase(sl()));
  sl.registerFactory(() => VoteBloc(castVote: sl()));

  // Profile
  sl.registerLazySingleton<ProfileRemoteDataSource>(
    () => ProfileRemoteDataSourceImpl(sl<DioClient>().dio),
  );
  sl.registerLazySingleton<ProfileRepository>(
    () => ProfileRepositoryImpl(sl()),
  );
  sl.registerLazySingleton(() => GetProfileUseCase(sl()));
}
