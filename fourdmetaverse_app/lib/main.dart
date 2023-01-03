import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';

import 'package:fourdmetaverse_app/global_keys.dart';
import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/utility/injector.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  CustomNavigator customNavigator = CustomNavigator();

  @override
  void initState() {
    super.initState();
    initializeGetit();
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Provider.value(
      value: customNavigator,
      child: MaterialApp(
        navigatorKey: GlobalKeys.rootNavKey,
        title: '4DMetaverse',
        theme: ThemeData(
          primaryColor: const Color.fromRGBO(96, 150, 212, 1),
          primaryColorLight: const Color.fromRGBO(148, 198, 255, 1),
          primaryColorDark: const Color.fromRGBO(39, 104, 162, 1),
          disabledColor: const Color.fromRGBO(114, 114, 118, 1),
          errorColor: const Color.fromRGBO(241, 94, 74, 1),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            elevation: 0,
            systemOverlayStyle: SystemUiOverlayStyle(
              statusBarBrightness: Brightness.light,
            ),
          ),
          scaffoldBackgroundColor: Colors.white,
          fontFamily: 'Noto Sans CJK',
        ),
        initialRoute: '/',
        onGenerateRoute: customNavigator.onGenerateRoute,
        builder: EasyLoading.init(
          builder: (BuildContext context, Widget? child) =>
              child ?? Container(),
        ),
      ),
    );
  }
}
