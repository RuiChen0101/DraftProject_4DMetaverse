import 'dart:async';
import 'package:flutter/material.dart';

class CountDownButton extends StatefulWidget {
  final String id;
  final Widget text;
  final bool initDisable;
  final Widget disableText;
  final ButtonStyle? style;
  final VoidCallback onPressed;
  final Duration disableDuration;
  final ButtonStyle? disableStyle;

  const CountDownButton(
      {Key? key,
      required this.onPressed,
      required this.id,
      required this.disableDuration,
      this.style,
      this.initDisable = false,
      ButtonStyle? disableStyle,
      this.text = const Text(''),
      Widget? disableText})
      : disableText = disableText ?? text,
        disableStyle = disableStyle ?? style,
        super(key: key);

  @override
  State<StatefulWidget> createState() => _CountDownButton();
}

class _CountDownButton extends State<CountDownButton> {
  bool enable = false;
  DateTime endTime = DateTime.now();
  String remainTimeStr = '';
  late Timer clock;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _setUp();
    });
    clock = Timer.periodic(const Duration(seconds: 1), (_) => _updateTime());
  }

  @override
  void dispose() {
    clock.cancel();
    super.dispose();
  }

  Future<void> _setUp() async {
    if (widget.initDisable) {
      enable = false;
      endTime = DateTime.now().add(widget.disableDuration);
      setState(() {});
      return;
    }

    setState(() {
      enable = true;
    });
    return;
  }

  Future<void> _updateTime() async {
    if (enable) return;
    if (endTime.isBefore(DateTime.now())) {
      setState(() {
        enable = true;
      });
      return;
    } else {
      Duration remainTime = endTime.difference(DateTime.now());
      setState(() {
        remainTimeStr = '${remainTime.inSeconds}s';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      style: enable ? widget.style : widget.disableStyle,
      onPressed: enable ? onPress : null,
      child: enable
          ? widget.text
          : Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                widget.disableText,
                Text(
                  '($remainTimeStr)',
                  style: TextStyle(
                    color: Theme.of(context).disabledColor,
                  ),
                ),
              ],
            ),
    );
  }

  Future<void> onPress() async {
    enable = false;
    endTime = DateTime.now().add(widget.disableDuration);
    setState(() {});
    widget.onPressed();
  }
}
