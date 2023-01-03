import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/component/unfocused_scope.dart';
import 'package:fourdmetaverse_app/bloc/enable_2fa/enable_2fa_bloc.dart';
import 'package:fourdmetaverse_app/page/enable_2fa/enable_2fa_phone_page.dart';
import 'package:fourdmetaverse_app/page/enable_2fa/enable_2fa_verify_page.dart';

class Enable2FAMain extends StatelessWidget {
  const Enable2FAMain({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return UnfocusedScope(
      child: BlocProvider<Enable2FABloc>(
        create: ((context) => Enable2FABloc()),
        child: BlocConsumer<Enable2FABloc, Enable2FAState>(
          listener: (context, state) {
            if (state is Enable2FAToHome) {
              context.read<CustomNavigator>().pushReplacementNamed("/home");
            }
          },
          builder: (context, state) {
            if (state.errorMessage != null && state.errorMessage != "") {
              Fluttertoast.showToast(
                msg: state.errorMessage!,
                toastLength: Toast.LENGTH_LONG,
                backgroundColor: Theme.of(context).errorColor,
              );
            }
            if (state is Enable2FAPhone) {
              return Enable2FAPhonePage(
                isLoading: state.isLoading,
              );
            } else if (state is Enable2FAVerify) {
              return Enable2FAVerifyPage(
                phone: state.phone,
                isLoading: state.isLoading,
              );
            }
            return Container();
          },
        ),
      ),
    );
  }
}
