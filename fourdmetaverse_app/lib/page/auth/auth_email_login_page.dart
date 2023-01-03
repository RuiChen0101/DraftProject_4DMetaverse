import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fourdmetaverse_app/component/input_field/hidden_input_field.dart';

import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/bloc/authorization/authorization_bloc.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class AuthEmailLoginPage extends StatefulWidget {
  final String email;
  final bool isLoading;
  const AuthEmailLoginPage({Key? key, this.email = "", this.isLoading = false})
      : super(key: key);

  @override
  State<AuthEmailLoginPage> createState() => _AuthEmailLoginPageState();
}

class _AuthEmailLoginPageState extends State<AuthEmailLoginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "登入",
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
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromRGBO(179, 172, 162, 1)),
                        ),
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
          ),
        ],
      ),
      bottomSheet: ScaffoldBottomSheet(
        child: SizedBox(
          height: 45,
          width: double.infinity,
          child: ToggleDisableButton(
            enabled: !widget.isLoading,
            onPressed: () {
              FocusScope.of(context).unfocus();
              if (!_formKey.currentState!.validate()) return;
              BlocProvider.of<AuthorizationBloc>(context).add(
                  AuthorizationEmailLogin(
                      widget.email, passwordController.text));
            },
            style: ShareButtonStyle.normalStyle,
            disableStyle: ShareButtonStyle.disableStyle,
            text: const Text(
              '登入',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
