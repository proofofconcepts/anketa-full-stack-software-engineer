import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

const String _baseUrl = 'http://localhost:3000/api';

class DioClient {
  late final Dio _dio;

  DioClient(SharedPreferences prefs) {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ));

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = prefs.getString('accessToken');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshToken = prefs.getString('refreshToken');
            if (refreshToken != null) {
              try {
                final response = await _dio.post(
                  '/auth/refresh',
                  data: {'refreshToken': refreshToken},
                  options: Options(headers: {'Authorization': null}),
                );
                final newAccessToken = response.data['accessToken'] as String;
                final newRefreshToken = response.data['refreshToken'] as String;
                await prefs.setString('accessToken', newAccessToken);
                await prefs.setString('refreshToken', newRefreshToken);

                error.requestOptions.headers['Authorization'] =
                    'Bearer $newAccessToken';
                final retryResponse = await _dio.fetch(error.requestOptions);
                handler.resolve(retryResponse);
                return;
              } catch (_) {
                await prefs.remove('accessToken');
                await prefs.remove('refreshToken');
              }
            }
          }
          handler.next(error);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
