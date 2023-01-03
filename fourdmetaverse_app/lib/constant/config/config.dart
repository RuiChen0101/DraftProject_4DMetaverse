import 'package:fourdmetaverse_app/constant/config/config_base.dart';
import 'package:fourdmetaverse_app/constant/config/local_config.dart';

enum Environment { UNDEF, TEST, LOCAL, DEV, STAGING, PROD }

class Config {
  static late ConfigBase _config;
  static Environment _env = Environment.DEV;

  static void setEnvironment() {
    const String flavor =
        String.fromEnvironment('app.flavor', defaultValue: 'local');
    switch (flavor) {
      case 'local':
        _config = LocalConfig();
        Config._env = Environment.LOCAL;
        break;
    }
  }

  static String get backendUrl => _config.backendUrl;

  static String get version => _config.version;

  static Environment get env {
    return Config._env;
  }
}
