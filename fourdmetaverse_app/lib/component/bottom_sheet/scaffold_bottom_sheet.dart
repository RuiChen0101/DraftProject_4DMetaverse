import 'package:flutter/material.dart';

class ScaffoldBottomSheet extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const ScaffoldBottomSheet(
      {Key? key,
      required this.child,
      this.padding =
          const EdgeInsets.only(top: 16, bottom: 32, left: 16, right: 16)})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Container(
        alignment: Alignment.topCenter,
        decoration: const BoxDecoration(
          color: Colors.white,
        ),
        padding: padding,
        child: child,
      ),
    );
  }
}
