import 'package:fourdmetaverse_app/constant/config/config_base.dart';

class LocalConfig extends ConfigBase {
  LocalConfig()
      : super(
          backendUrl: "http://10.0.2.2:5001/four-d-metaverse-dev/us-central1",
          version: "0.1.0_b",
        );
}
