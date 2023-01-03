import 'package:flutter/material.dart';

class LinearLoadingIndicator extends StatelessWidget {
  const LinearLoadingIndicator({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      color: Theme.of(context).primaryColor,
      backgroundColor: Theme.of(context).primaryColorLight,
    );
  }
}
