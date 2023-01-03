import 'package:flutter/material.dart';

class ShareButtonStyle {
  static final ButtonStyle normalStyle = OutlinedButton.styleFrom(
    primary: Colors.white,
    backgroundColor: const Color.fromRGBO(96, 150, 212, 1),
    textStyle: const TextStyle(fontSize: 16, color: Colors.white),
    shape: RoundedRectangleBorder(
      side: const BorderSide(color: Color.fromRGBO(96, 150, 212, 1)),
      borderRadius: BorderRadius.circular(5),
    ),
  );
  static final ButtonStyle normalOutlineStyle = OutlinedButton.styleFrom(
    textStyle:
        const TextStyle(fontSize: 16, color: Color.fromRGBO(96, 150, 212, 1)),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(5),
    ),
    side: const BorderSide(color: Color.fromRGBO(96, 150, 212, 1)),
  );
  static final ButtonStyle disableStyle = OutlinedButton.styleFrom(
    primary: Colors.white,
    backgroundColor: const Color.fromRGBO(148, 198, 255, 1),
    textStyle: const TextStyle(fontSize: 16, color: Colors.white),
    shape: RoundedRectangleBorder(
      side: const BorderSide(color: Color.fromRGBO(148, 198, 255, 1)),
      borderRadius: BorderRadius.circular(5),
    ),
  );
}
