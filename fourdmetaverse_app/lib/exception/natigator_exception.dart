class NavigatorException implements Exception {
  final String message;
  NavigatorException({this.message = ''});

  @override
  String toString() => "NavigatorException: $message";
}
