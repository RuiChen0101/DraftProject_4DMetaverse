import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/bloc/authorization/authorization_bloc.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';
import 'package:fourdmetaverse_app/component/input_field/hidden_input_field.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class AuthEmailRegistrationPage extends StatefulWidget {
  final String email;
  final bool isLoading;
  const AuthEmailRegistrationPage(
      {Key? key, this.email = "", this.isLoading = false})
      : super(key: key);

  @override
  State<AuthEmailRegistrationPage> createState() =>
      _AuthEmailRegistrationPageState();
}

class _AuthEmailRegistrationPageState extends State<AuthEmailRegistrationPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "註冊",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          onPressed: () {
            BlocProvider.of<AuthorizationBloc>(context)
                .add(AuthorizationReturn());
          },
          icon: const Icon(Icons.arrow_back_ios),
        ),
      ),
      body: Column(
        children: [
          VisibilityWidget(
            visibility: widget.isLoading,
            replacer: const SizedBox(
              height: 4,
            ),
            child: const LinearLoadingIndicator(),
          ),
          const SizedBox(
            height: 12,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Email",
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  TextFormField(
                    initialValue: widget.email,
                    enabled: false,
                    style: TextStyle(
                      fontSize: 16,
                      color: Theme.of(context).disabledColor,
                    ),
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.all(16),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  Text(
                    "用戶名稱",
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  TextFormField(
                    controller: nameController,
                    enabled: !widget.isLoading,
                    style: const TextStyle(fontSize: 16),
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Color.fromRGBO(179, 172, 162, 1)),
                      ),
                      hintText: 'Enter name',
                    ),
                    validator: (String? text) {
                      if (text == null || text.isEmpty) {
                        return '請輸入用戶名稱';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  Text(
                    "密碼",
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  HiddenInputField(
                    controller: passwordController,
                    enabled: !widget.isLoading,
                    style: const TextStyle(fontSize: 16),
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      hintText: 'Enter password',
                    ),
                    validator: (String? text) {
                      if (text == null || text.isEmpty) {
                        return '請輸入密碼';
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: ScaffoldBottomSheet(
        child: Column(
          children: [
            RichText(
              text: TextSpan(
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.black,
                ),
                children: <InlineSpan>[
                  const TextSpan(text: "註冊即表示您已閱讀並同意"),
                  TextSpan(
                    text: "隱私權使用政策",
                    style: const TextStyle(
                      color: Colors.blue,
                      decoration: TextDecoration.underline,
                    ),
                    recognizer: TapGestureRecognizer()..onTap = () {},
                  ),
                  const TextSpan(text: "及"),
                  TextSpan(
                    text: "服務條款",
                    style: const TextStyle(
                      color: Colors.blue,
                      decoration: TextDecoration.underline,
                    ),
                    recognizer: TapGestureRecognizer()..onTap = () {},
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 8,
            ),
            SizedBox(
              height: 45,
              width: double.infinity,
              child: ToggleDisableButton(
                enabled: !widget.isLoading,
                onPressed: () {
                  FocusScope.of(context).unfocus();
                  if (!_formKey.currentState!.validate()) return;
                  BlocProvider.of<AuthorizationBloc>(context)
                      .add(AuthorizationEmailCreate(
                    widget.email,
                    nameController.text,
                    passwordController.text,
                  ));
                },
                style: ShareButtonStyle.normalStyle,
                disableStyle: ShareButtonStyle.disableStyle,
                text: const Text(
                  '註冊',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
