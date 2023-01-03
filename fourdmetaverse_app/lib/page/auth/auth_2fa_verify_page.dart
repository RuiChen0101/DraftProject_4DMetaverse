import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/component/button/countdown_button.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/bloc/authorization/authorization_bloc.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class Auth2FAVerifyPage extends StatefulWidget {
  final bool isLoading;
  final String phone;
  final String tempToken;
  const Auth2FAVerifyPage(
      {Key? key,
      required this.phone,
      required this.tempToken,
      this.isLoading = false})
      : super(key: key);

  @override
  State<Auth2FAVerifyPage> createState() => _Auth2FAVerifyPageState();
}

class _Auth2FAVerifyPageState extends State<Auth2FAVerifyPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "二階段驗證",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
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
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "請輸入傳送至以下號碼的 6 位數驗證碼：\n+${widget.phone}",
                      style: TextStyle(
                        fontSize: 16,
                        height: 1.5,
                        color: Theme.of(context).disabledColor,
                      ),
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    Text(
                      "驗證碼",
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).disabledColor,
                      ),
                    ),
                    const SizedBox(
                      height: 8,
                    ),
                    PinCodeTextField(
                      controller: _controller,
                      showCursor: false,
                      appContext: context,
                      length: 6,
                      keyboardType: TextInputType.number,
                      animationType: AnimationType.none,
                      pinTheme: PinTheme(
                        shape: PinCodeFieldShape.box,
                        borderRadius: BorderRadius.circular(4),
                        borderWidth: 1,
                        activeColor: Colors.grey,
                        selectedColor: Theme.of(context).primaryColor,
                        inactiveColor: Colors.grey,
                      ),
                      validator: (String? text) {
                        if (text == null || text == "") return "請輸入驗證碼";
                        if (text.length != 6) return "請完整輸入6位驗整碼";
                      },
                      onChanged: (String value) {},
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    Center(
                      child: CountDownButton(
                        onPressed: () =>
                            BlocProvider.of<AuthorizationBloc>(context).add(
                                AuthorizationVerifyCodeResend(
                                    widget.phone, widget.tempToken)),
                        id: '${widget.phone}resend_sms',
                        initDisable: true,
                        disableDuration: const Duration(minutes: 5),
                        text: Text(
                          "沒有收到驗證碼嗎?",
                          style: TextStyle(
                            fontSize: 12,
                            color: Theme.of(context).primaryColor,
                          ),
                        ),
                        disableText: Text(
                          "重新傳送驗證碼",
                          style: TextStyle(
                            fontSize: 12,
                            color: Theme.of(context).disabledColor,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          side: const BorderSide(color: Colors.transparent),
                        ),
                      ),
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
                  AuthorizationVerifyCodeEnter(
                      widget.phone, _controller.text, widget.tempToken));
            },
            style: ShareButtonStyle.normalStyle,
            disableStyle: ShareButtonStyle.disableStyle,
            text: const Text(
              '登入',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w900),
            ),
          ),
        ),
      ),
    );
  }
}
