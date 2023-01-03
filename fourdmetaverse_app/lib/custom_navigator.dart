import 'package:flutter/material.dart';

import 'package:fourdmetaverse_app/global_keys.dart';
import 'package:fourdmetaverse_app/backend/core.dart';
import 'package:fourdmetaverse_app/main_initializer.dart';
import 'package:fourdmetaverse_app/backend/auth/auth.dart';
import 'package:fourdmetaverse_app/page/auth/auth_main.dart';
import 'package:fourdmetaverse_app/backend/auth/token_data.dart';
import 'package:fourdmetaverse_app/exception/natigator_exception.dart';
import 'package:fourdmetaverse_app/page/enable_2fa/enable_2fa_main.dart';
import 'package:fourdmetaverse_app/page/home_page.dart';

typedef WidgetBuilder = Widget Function(BuildContext, Object?);
typedef AuthCheck = bool Function(TokenData?);

class Route {
  final WidgetBuilder builder;
  final AuthCheck? authCheck;

  Route({required this.builder, this.authCheck});
}

class CustomNavigator {
  static final Map<String, Route> routes = {
    "/": Route(
      builder: (context, argument) => const MainInitializer(),
    ),
    "/authorization": Route(
      builder: (context, argument) => const AuthMain(),
    ),
    "/enable_2fa": Route(
      builder: (context, argument) => const Enable2FAMain(),
      authCheck: (data) => data != null,
    ),
    "/home": Route(
      builder: (context, argument) => const HomePage(),
      authCheck: (data) => data != null,
    ),
  };

  CustomNavigator() {
    Core.I.addAuthLostListener(_onAuthLost);
  }

  MaterialPageRoute? onGenerateRoute(RouteSettings settings) {
    Route? route = CustomNavigator.routes[settings.name];
    if (route == null) return null;
    return _buildRoute(settings.name!, route, settings.arguments);
  }

  void pushReplacementNamed(String routeName, {Object? argument}) {
    _checkRouteAuth(routeName);
    GlobalKeys.rootNavKey.currentState!
        .pushReplacementNamed(routeName, arguments: argument);
  }

  void pushNamed(String routeName, {Object? argument}) {
    _checkRouteAuth(routeName);
    GlobalKeys.rootNavKey.currentState!
        .pushNamed(routeName, arguments: argument);
  }

  void _checkRouteAuth(String routeName) {
    Route? route = routes[routeName];
    if (route == null) {
      throw NavigatorException(message: "No such route - $routeName");
    }
    if (route.authCheck != null && !route.authCheck!(Auth.I.accessTokenData)) {
      throw NavigatorException(message: "Forbidden route - $routeName");
    }
  }

  void _onAuthLost() {
    GlobalKeys.rootNavKey.currentState?.pushNamed("/authorization");
  }

  MaterialPageRoute _buildRoute(String name, Route route, Object? argument) {
    return MaterialPageRoute(
        settings: RouteSettings(name: name),
        builder: (BuildContext context) => route.builder(context, argument));
  }
}
