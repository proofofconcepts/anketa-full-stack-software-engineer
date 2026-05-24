import 'package:dio/dio.dart';
import 'package:anketa/core/error/failures.dart';
import '../models/profile_model.dart';

abstract class ProfileRemoteDataSource {
  Future<ProfileModel> getProfile(String username);
  Future<void> follow(String userId);
  Future<void> unfollow(String userId);
}

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final Dio _dio;
  const ProfileRemoteDataSourceImpl(this._dio);

  @override
  Future<ProfileModel> getProfile(String username) async {
    try {
      final response = await _dio.get('/users/$username');
      return ProfileModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<void> follow(String userId) async {
    try {
      await _dio.post('/users/$userId/follow');
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<void> unfollow(String userId) async {
    try {
      await _dio.delete('/users/$userId/follow');
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Failure _mapError(DioException e) {
    final status = e.response?.statusCode;
    final message =
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            e.message ??
            'Unknown error';
    if (status == 401) return const UnauthorizedFailure();
    if (status == 404) return NotFoundFailure(message);
    if (status != null) return ServerFailure(message, statusCode: status);
    return NetworkFailure(message);
  }
}
