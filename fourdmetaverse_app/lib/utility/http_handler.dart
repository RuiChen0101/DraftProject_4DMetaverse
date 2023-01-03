import 'dart:convert';

import 'package:http/http.dart' as http;

enum HttpMethod { get, post, put, delete }

http.Client _client = http.Client();

bool isOk(http.Response res) {
  return res.statusCode < 400;
}

Future<http.Response> handleHttpRequest({
  required String url,
  required HttpMethod method,
  Map<String, String>? header,
  String? body,
}) {
  switch (method) {
    case HttpMethod.get:
      return _client.get(
        Uri.parse(url),
        headers: header,
      );
    case HttpMethod.post:
      return _client.post(
        Uri.parse(url),
        headers: header,
        body: body,
      );
    case HttpMethod.put:
      return _client.put(
        Uri.parse(url),
        headers: header,
        body: body,
      );
    case HttpMethod.delete:
      return _client.delete(
        Uri.parse(url),
        headers: header,
        body: body,
      );
  }
}
