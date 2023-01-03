import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/bloc/enable_2fa/enable_2fa_bloc.dart';
import 'package:fourdmetaverse_app/component/button/countdown_button.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class Enable2FAVerifyPage extends StatefulWidget {
  final bool isLoading;
  final String phone;
  const Enable2FAVerifyPage(
      {Key? key, required this.phone, this.isLoading = false})
      : super(key: key);

  @override
  State<Enable2FAVerifyPage> createState() => _Enable2FAVerifyPageState();
}

class _Enable2FAVerifyPageState extends State<Enable2FAVerifyPage> {
  final TextEditingController _controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "保護您的帳號",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        automaticallyImplyLeading: false,
        actions: [
          TextButton(
            onPressed: () {
              context.read<CustomNavigator>().pushReplacementNamed("/home");
            },
            child: Text(
              '略過',
              style: TextStyle(
                fontSize: 16,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ),
        ],
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
                    onChanged: (String value) {},
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  Center(
                    child: CountDownButton(
                      onPressed: () => BlocProvider.of<Enable2FABloc>(context)
                          .add(const Enable2FAVerifyCodeResend()),
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
              if (_controller.text == "") return;
              BlocProvider.of<Enable2FABloc>(context)
                  .add(Enable2FAVerifyCodeEnter(_controller.text));
            },
            style: ShareButtonStyle.normalStyle,
            disableStyle: ShareButtonStyle.disableStyle,
            text: const Text(
              '確認',
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
