import 'package:flutter/material.dart';

class BottomNavBarItem extends StatelessWidget {
  final bool isDisplay;
  final IconData icon;
  final String text;
  final VoidCallback onTabClick;
  const BottomNavBarItem({
    Key? key,
    required this.icon,
    required this.text,
    required this.onTabClick,
    this.isDisplay = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color tabColor = isDisplay
        ? Theme.of(context).primaryColor
        : Theme.of(context).disabledColor;
    return Expanded(
      child: SizedBox(
        height: 60,
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            onTap: onTabClick,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(icon, color: tabColor, size: 24),
                Text(
                  text,
                  style: TextStyle(color: tabColor, fontSize: 8),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
