import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:fourdmetaverse_app/backend/core.dart';
import 'package:fourdmetaverse_app/entities/user_entity.dart';
import 'package:fourdmetaverse_app/utility/http_handler.dart';
import 'package:fourdmetaverse_app/exception/backend_exception.dart';

class User {
  static User get I {
    return Core.I.getOrInitialize<User>((core) => User(core));
  }

  final Core _core;
  User(this._core);

  Future<bool> checkEmail(String email) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: '/user/check/email?email=$email',
      method: HttpMethod.get,
    ));
    return isOk(res);
  }

  Future<void> createByEmail({
    required String name,
    required String email,
    required String password,
  }) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: '/user/create?method=email',
      method: HttpMethod.post,
      body: '{"name":"$name","email":"$email","password":"$password"}',
      json: true,
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Create user fail: response ${res.statusCode}");
    }
  }

  Future<void> sendVerifySms(String phone) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: "/verifysms/send?phone=$phone",
      method: HttpMethod.get,
      auth: true,
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Verify sms send fail: response ${res.statusCode}");
    }
  }

  Future<void> enable2FA(String phone, String verifyCode) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: '/user/2fa_enable',
      method: HttpMethod.put,
      body: '{"phone":"$phone","verifyCode":"$verifyCode"}',
      json: true,
      auth: true,
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Enable 2fa fail: response ${res.statusCode}");
    }
  }

  Future<UserEntity> getUser(String id) async {
    http.Response res = await _core.callApi(ApiRequest(
      url: '/user/get?userId=$id',
      method: HttpMethod.get,
      auth: true,
    ));
    if (!isOk(res)) {
      throw BackendException(
          message: "Get user fail: response ${res.statusCode}");
    }
    return UserEntity.fromJson(jsonDecode(res.body));
  }
}
