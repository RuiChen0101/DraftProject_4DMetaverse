import 'package:flutter/material.dart';

class VisibilityWidget extends StatelessWidget {
  final bool visibility;
  final Widget child;
  final Widget? replacer;

  const VisibilityWidget(
      {Key? key, required this.visibility, required this.child, this.replacer})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return visibility ? child : (replacer == null ? Container() : replacer!);
  }
}
