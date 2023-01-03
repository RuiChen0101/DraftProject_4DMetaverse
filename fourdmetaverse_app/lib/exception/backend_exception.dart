class BackendException implements Exception {
  final String message;
  BackendException({this.message = ''});

  @override
  String toString() => "BackendException: $message";
}
