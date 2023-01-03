import 'package:http/http.dart' as http;

import 'package:fourdmetaverse_app/backend/auth/auth.dart';
import 'package:fourdmetaverse_app/utility/http_handler.dart';
import 'package:fourdmetaverse_app/constant/config/config.dart';
import 'package:fourdmetaverse_app/exception/backend_exception.dart';

typedef VoidCallback = void Function();
typedef ServiceBuild<T> = T Function(Core);

class ApiRequest {
  final String url;
  final HttpMethod method;
  final Map<String, String> header;
  final String? body;
  final bool json;
  final bool auth;

  ApiRequest({
    required this.url,
    required this.method,
    this.header = const {},
    this.body,
    this.json = false,
    this.auth = false,
  });
}

class Core {
  static final Core _instance = Core._();
  static Core get I {
    return _instance;
  }

  final List<VoidCallback> _tokenListeners = [];
  final Map<String, dynamic> _services = {};

  Core._();

  void addAuthLostListener(VoidCallback func) {
    _tokenListeners.add(func);
  }

  void authLost() {
    for (var element in _tokenListeners) {
      element();
    }
  }

  T getOrInitialize<T>(ServiceBuild<T> builder) {
    String name = T.toString();
    if (_services.containsKey(name)) {
      return _services[name] as T;
    }
    _services[name] = builder(this);
    return _services[name];
  }

  Future<http.Response> callApi(ApiRequest request) async {
    Map<String, String> header = Map<String, String>.from(request.header);
    if (request.json) {
      header["Content-Type"] = "application/json";
    }
    if (request.auth) {
      String token = await _loadAuth();
      header["Authorization"] = "Bearer $token";
    }
    return handleHttpRequest(
      url: "${Config.backendUrl}${request.url}",
      method: request.method,
      header: header,
      body: request.body,
    );
  }

  Future<String> _loadAuth() async {
    if (!_services.containsKey("Auth")) {
      throw BackendException(message: "No authorization");
    }
    Auth auth = _services["Auth"] as Auth;
    if (auth.accessToken == null) {
      throw BackendException(message: "No authorization");
    }
    double now = DateTime.now().millisecondsSinceEpoch / 1000;
    if (now > (auth.accessTokenData!.exp - 15)) {
      await auth.refreshingToken();
    }
    return auth.accessToken!;
  }
}
