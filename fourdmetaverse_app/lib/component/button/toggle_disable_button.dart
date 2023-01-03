import 'package:flutter/material.dart';

class ToggleDisableButton extends StatelessWidget {
  final bool enabled;
  final Widget text;
  final Widget disableText;
  final ButtonStyle? style;
  final ButtonStyle? disableStyle;
  final VoidCallback onPressed;

  const ToggleDisableButton(
      {Key? key,
      required this.onPressed,
      this.enabled = true,
      this.style,
      ButtonStyle? disableStyle,
      this.text = const Text(''),
      Widget? disableText})
      : disableText = disableText ?? text,
        disableStyle = disableStyle ?? style,
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      style: enabled ? style : disableStyle,
      onPressed: enabled ? onPressed : null,
      child: enabled ? text : disableText,
    );
  }
}
