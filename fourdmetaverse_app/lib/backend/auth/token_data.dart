import 'package:jwt_decode/jwt_decode.dart';

class TokenData {
  final String id;
  final int type;
  final List<String> allow;
  final int role;
  final int flag;
  final int status;
  final String nonce;
  final int iat;
  final int exp;

  TokenData({
    required this.id,
    required this.type,
    required this.allow,
    required this.role,
    required this.flag,
    required this.status,
    required this.nonce,
    required this.iat,
    required this.exp,
  });

  factory TokenData.fromJwt(String jwt) {
    Map<String, dynamic> payload = Jwt.parseJwt(jwt);
    return TokenData(
      id: payload["id"],
      type: payload["type"],
      allow:
          (payload["allow"] as List<dynamic>).map((e) => e as String).toList(),
      role: payload["role"],
      flag: payload["flag"],
      status: payload["status"],
      nonce: payload["nonce"],
      iat: payload["iat"],
      exp: payload["exp"],
    );
  }
}
