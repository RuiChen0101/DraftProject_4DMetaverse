import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:fourdmetaverse_app/backend/core.dart';
import 'package:fourdmetaverse_app/utility/http_handler.dart';
import 'package:fourdmetaverse_app/backend/auth/token_data.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fourdmetaverse_app/exception/backend_exception.dart';

class Auth {
  static Auth get I {
    return Core.I.getOrInitialize<Auth>((core) => Auth(core));
  }

  final Core _core;
  final FlutterSecureStorage storage = const FlutterSecureStorage();
  String? _refreshToken;
  String? _accessToken;
  TokenData? _accessTokenData;

  String? get accessToken => _accessToken;
  TokenData? get accessTokenData => _accessTokenData;

  Auth(this._core);

  Future<void> initializeAuth() async {
    _refreshToken = await storage.read(key: "refresh_token");
    try {
      await refreshingToken();
    } catch (_) {}
  }

  Future<Map<String, dynamic>> loginWithEmail(
    String email,
    String password,
  ) async {
    String basicToken = base64Encode(utf8.encode('$email:$password'));
    http.Response res = await _core.callApi(ApiRequest(
      url: "/auth/login",
      method: HttpMethod.get,
      header: {"Authorization": "Basic $basicToken"},
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Login with email fail: response ${res.statusCode}");
    }
    Map<String, dynamic> data = Map.from(jsonDecode(res.body));
    if (data.containsKey("refreshToken")) {
      await _setRefreshToken(data["refreshToken"]!);
      _accessToken = data["accessToken"];
      _accessTokenData = TokenData.fromJwt(_accessToken!);
    }
    return data;
  }

  Future<void> sendVerifySms(String phone, String tempToken) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: "/verifysms/send?phone=$phone",
      method: HttpMethod.get,
      header: {"Authorization": "Bearer $tempToken"},
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Verify sms send fail: response ${res.statusCode}");
    }
  }

  Future<void> verify2FA(String verifyCode, String tempToken) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: "/auth/2fa_verify?verifyCode=$verifyCode",
      method: HttpMethod.get,
      header: {"Authorization": "Bearer $tempToken"},
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "2FA verify fail: response ${res.statusCode}");
    }
    Map<String, dynamic> data = Map.from(jsonDecode(res.body));
    await _setRefreshToken(data["refreshToken"]!);
    _accessToken = data["accessToken"];
    _accessTokenData = TokenData.fromJwt(_accessToken!);
  }

  Future<void> logout() async {
    await _core.callApi(ApiRequest(
      url: "/auth/logout",
      method: HttpMethod.get,
      auth: true,
    ));
    _refreshToken = null;
    _accessToken = null;
    _accessTokenData = null;
    _core.authLost();
  }

  Future<void> refreshingToken() async {
    if (_refreshToken == null) {
      throw BackendException(message: "Missing refresh token");
    }
    http.Response res = await _core.callApi(ApiRequest(
      url: "/auth/refresh",
      method: HttpMethod.get,
      header: {"Authorization": "Bearer ${_refreshToken!}"},
    ));
    if (!isOk(res)) {
      _refreshToken = null;
      _accessToken = null;
      _accessTokenData = null;
      _core.authLost();
      return;
    }
    Map<String, dynamic> data = Map.from(jsonDecode(res.body));
    await _setRefreshToken(data["refreshToken"]!);
    _accessToken = data["accessToken"];
    _accessTokenData = TokenData.fromJwt(_accessToken!);
  }

  Future<void> _setRefreshToken(String token) async {
    await storage.write(key: "refresh_token", value: token);
    _refreshToken = token;
  }
}
