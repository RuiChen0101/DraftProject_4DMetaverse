import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl_phone_number_input/intl_phone_number_input.dart';
import 'package:fourdmetaverse_app/bloc/enable_2fa/enable_2fa_bloc.dart';

import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class Enable2FAPhonePage extends StatefulWidget {
  final bool isLoading;
  const Enable2FAPhonePage({Key? key, this.isLoading = false})
      : super(key: key);

  @override
  State<Enable2FAPhonePage> createState() => _Enable2FAPhonePageState();
}

class _Enable2FAPhonePageState extends State<Enable2FAPhonePage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  PhoneNumber number = PhoneNumber(isoCode: "TW");
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
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "設定您的手機以啟用二階段驗證",
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontSize: 20,
                      ),
                    ),
                    const SizedBox(
                      height: 8,
                    ),
                    InternationalPhoneNumberInput(
                      selectorConfig: const SelectorConfig(
                        selectorType: PhoneInputSelectorType.BOTTOM_SHEET,
                      ),
                      initialValue: PhoneNumber(isoCode: "TW"),
                      inputDecoration: const InputDecoration(
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Color.fromRGBO(179, 172, 162, 1),
                          ),
                        ),
                        hintText: "Phone number",
                      ),
                      isEnabled: !widget.isLoading,
                      onInputChanged: (value) {
                        setState(() {
                          number = value;
                        });
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
              BlocProvider.of<Enable2FABloc>(context)
                  .add(Enable2FAPhoneEnter(number.toString()));
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
