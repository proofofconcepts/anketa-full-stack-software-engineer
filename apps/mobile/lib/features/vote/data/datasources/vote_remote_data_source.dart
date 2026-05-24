import 'package:dio/dio.dart';
import 'package:anketa/core/error/failures.dart';
import 'package:anketa/features/polls/data/models/poll_model.dart';
import 'package:anketa/features/polls/domain/entities/option.dart';

abstract class VoteRemoteDataSource {
  Future<List<Option>> castVote({
    required String pollId,
    required String optionId,
  });
}

class VoteRemoteDataSourceImpl implements VoteRemoteDataSource {
  final Dio _dio;
  const VoteRemoteDataSourceImpl(this._dio);

  @override
  Future<List<Option>> castVote({
    required String pollId,
    required String optionId,
  }) async {
    try {
      final response = await _dio.post(
        '/polls/$pollId/vote',
        data: {'optionId': optionId},
      );
      final data = response.data as Map<String, dynamic>;
      return (data['options'] as List<dynamic>)
          .map((e) => OptionModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final message =
          (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
              e.message ??
              'Unknown error';
      if (status == 401) throw const UnauthorizedFailure();
      if (status == 409) throw ConflictFailure(message);
      if (status != null) throw ServerFailure(message, statusCode: status);
      throw NetworkFailure(message);
    }
  }
}
