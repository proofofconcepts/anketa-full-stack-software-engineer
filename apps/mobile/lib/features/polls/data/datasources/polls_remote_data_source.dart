import 'package:dio/dio.dart';
import 'package:anketa/core/error/failures.dart';
import '../models/poll_model.dart';

abstract class PollsRemoteDataSource {
  Future<List<PollModel>> getTrending({int page = 1, int limit = 10});
  Future<List<PollModel>> getFollowing({int page = 1, int limit = 10});
  Future<PollModel> getOne(String pollId);
  Future<PollModel> create(Map<String, dynamic> body);
  Future<void> delete(String pollId);
}

class PollsRemoteDataSourceImpl implements PollsRemoteDataSource {
  final Dio _dio;
  const PollsRemoteDataSourceImpl(this._dio);

  @override
  Future<List<PollModel>> getTrending({int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/polls',
        queryParameters: {'page': page, 'limit': limit},
      );
      final data = response.data as Map<String, dynamic>;
      return (data['data'] as List<dynamic>)
          .map((e) => PollModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<List<PollModel>> getFollowing({int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/polls/following',
        queryParameters: {'page': page, 'limit': limit},
      );
      final data = response.data as Map<String, dynamic>;
      return (data['data'] as List<dynamic>)
          .map((e) => PollModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<PollModel> getOne(String pollId) async {
    try {
      final response = await _dio.get('/polls/$pollId');
      return PollModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<PollModel> create(Map<String, dynamic> body) async {
    try {
      final response = await _dio.post('/polls', data: body);
      return PollModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<void> delete(String pollId) async {
    try {
      await _dio.delete('/polls/$pollId');
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
