import 'package:flutter/material.dart';

typedef OnChangeCallback = void Function(String text);
typedef ValidationCallback = String? Function(String? text);

class HiddenInputField extends StatefulWidget {
  final bool enabled;
  final bool readonly;
  final String? initValue;
  final ValidationCallback? validator;
  final OnChangeCallback? onChange;
  final TextAlign? textAlign;
  final TextStyle? style;
  final InputDecoration decoration;
  final TextInputType? keyboardType;
  final AutovalidateMode? autovalidateMode;
  final TextEditingController? controller;
  const HiddenInputField({
    Key? key,
    this.initValue,
    this.onChange,
    this.validator,
    this.readonly = false,
    this.enabled = true,
    this.textAlign,
    this.style,
    this.decoration = const InputDecoration(),
    this.keyboardType,
    this.autovalidateMode,
    this.controller,
  }) : super(key: key);

  @override
  State<HiddenInputField> createState() => _HiddenInputFieldState();
}

class _HiddenInputFieldState extends State<HiddenInputField> {
  bool _isObscure = true;
  bool _isValid = true;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomRight,
      children: <Widget>[
        TextFormField(
          controller: widget.controller,
          keyboardType: widget.keyboardType,
          obscureText: _isObscure,
          initialValue: widget.initValue,
          decoration: InputDecoration(
            labelText: widget.decoration.labelText,
            hintText: widget.decoration.hintText,
            hintStyle: widget.decoration.hintStyle,
            floatingLabelBehavior: FloatingLabelBehavior.always,
            border: const OutlineInputBorder(
              borderSide: BorderSide(color: Color.fromRGBO(179, 172, 162, 1)),
            ),
            contentPadding: const EdgeInsets.all(16),
          ),
          validator: widget.validator == null
              ? null
              : (String? text) {
                  String? result = widget.validator!(text);
                  setState(() {
                    _isValid = result == null;
                  });
                  return result;
                },
          enabled: widget.enabled,
          readOnly: widget.readonly,
          onChanged: widget.onChange,
        ),
        Padding(
          padding:
              _isValid ? EdgeInsets.zero : const EdgeInsets.only(bottom: 26),
          child: IconButton(
            splashRadius: 16,
            icon: Icon(
              _isObscure ? Icons.visibility_off : Icons.visibility,
              color: Colors.black54,
              size: 20,
            ),
            onPressed: widget.enabled
                ? () => {setState(() => _isObscure = !_isObscure)}
                : null,
          ),
        )
      ],
    );
  }
}
