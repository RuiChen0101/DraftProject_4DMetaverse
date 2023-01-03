import 'package:flutter/material.dart';
import 'package:fourdmetaverse_app/constant/config/config.dart';
import 'package:provider/provider.dart';

import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/backend/auth/auth.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';

class MainInitializer extends StatefulWidget {
  const MainInitializer({Key? key}) : super(key: key);

  @override
  State<MainInitializer> createState() => _MainInitializerState();
}

class _MainInitializerState extends State<MainInitializer> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => initialize());
  }

  void initialize() async {
    Config.setEnvironment();
    Auth auth = Auth.I;
    await auth.initializeAuth();
    if (!mounted) return;
    if (auth.accessToken == null) {
      context.read<CustomNavigator>().pushReplacementNamed("/authorization");
    } else {
      context.read<CustomNavigator>().pushReplacementNamed("/home");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox.expand(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              height: MediaQuery.of(context).padding.top,
            ),
            const LinearLoadingIndicator(),
            const SizedBox(
              height: 108,
            ),
            Image.asset(
              'assets/images/logo.png',
              height: 188,
              fit: BoxFit.cover,
            ),
            const SizedBox(
              height: 20,
            ),
            const Text(
              "4DMetaverse",
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700),
            )
          ],
        ),
      ),
    );
  }
}
