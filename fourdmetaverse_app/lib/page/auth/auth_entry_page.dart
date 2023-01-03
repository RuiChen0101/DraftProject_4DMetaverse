import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fourdmetaverse_app/component/button/toggle_disable_button.dart';

import 'package:fourdmetaverse_app/component/visibility_widget.dart';
import 'package:fourdmetaverse_app/component/button/share_button_style.dart';
import 'package:fourdmetaverse_app/bloc/authorization/authorization_bloc.dart';
import 'package:fourdmetaverse_app/component/loading/linear_loading_indicator.dart';
import 'package:fourdmetaverse_app/component/bottom_sheet/scaffold_bottom_sheet.dart';

class AuthEntryPage extends StatefulWidget {
  final bool isLoading;

  const AuthEntryPage({Key? key, this.isLoading = false}) : super(key: key);

  @override
  State<AuthEntryPage> createState() => _AuthEntryPageState();
}

class _AuthEntryPageState extends State<AuthEntryPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "開始使用",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        automaticallyImplyLeading: false,
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
                      controller: emailController,
                      enabled: !widget.isLoading,
                      style: const TextStyle(fontSize: 16),
                      keyboardType: TextInputType.emailAddress,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      decoration: const InputDecoration(
                        contentPadding: EdgeInsets.all(16),
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Color.fromRGBO(179, 172, 162, 1)),
                        ),
                        hintText: 'Enter email',
                      ),
                      validator: (String? text) {
                        if (text == null || text.isEmpty) {
                          return '請輸入電子郵件';
                        } else if (!RegExp(
                          r'^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$',
                        ).hasMatch(text)) {
                          return '電子郵件格式不符';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(
                      height: 32,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: const [
                        Expanded(
                          child: Divider(
                            color: Colors.black,
                            thickness: 1,
                          ),
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Text(
                          "or",
                          style: TextStyle(fontSize: 12),
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Expanded(
                          child: Divider(
                            color: Colors.black,
                            thickness: 1,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(
                      height: 32,
                    ),
                    Material(
                      color: Colors.white,
                      child: OutlinedButton(
                        onPressed: () {},
                        style: ShareButtonStyle.normalOutlineStyle.copyWith(
                          padding: MaterialStateProperty.all(
                            const EdgeInsets.symmetric(
                              horizontal: 28,
                              vertical: 12,
                            ),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Image.asset(
                              "assets/images/icons/metamask.png",
                              height: 28,
                            ),
                            Text(
                              'METAMASK',
                              style: TextStyle(
                                fontSize: 16,
                                color: Theme.of(context).primaryColor,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            const SizedBox(
                              width: 30,
                            ),
                          ],
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
              BlocProvider.of<AuthorizationBloc>(context)
                  .add(AuthorizationEmailEnter(emailController.text));
            },
            style: ShareButtonStyle.normalStyle,
            disableStyle: ShareButtonStyle.disableStyle,
            text: const Text(
              '下一步',
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
