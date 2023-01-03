import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:fourdmetaverse_app/custom_navigator.dart';
import 'package:fourdmetaverse_app/component/unfocused_scope.dart';
import 'package:fourdmetaverse_app/page/auth/auth_2fa_verify_page.dart';
import 'package:fourdmetaverse_app/page/auth/auth_entry_page.dart';
import 'package:fourdmetaverse_app/page/auth/auth_email_login_page.dart';
import 'package:fourdmetaverse_app/bloc/authorization/authorization_bloc.dart';
import 'package:fourdmetaverse_app/page/auth/auth_email_registration_page.dart';

class AuthMain extends StatelessWidget {
  const AuthMain({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return UnfocusedScope(
      child: BlocProvider<AuthorizationBloc>(
        create: (context) => AuthorizationBloc(),
        child: BlocConsumer<AuthorizationBloc, AuthorizationState>(
          listener: (context, state) {
            if (state is AuthorizationToHome) {
              context.read<CustomNavigator>().pushReplacementNamed("/home");
            } else if (state is AuthorizationToEnable2FA) {
              context
                  .read<CustomNavigator>()
                  .pushReplacementNamed("/enable_2fa");
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
            if (state is AuthorizationEntry) {
              return AuthEntryPage(isLoading: state.isLoading);
            } else if (state is AuthorizationEmailRegistration) {
              return AuthEmailRegistrationPage(
                email: state.email,
                isLoading: state.isLoading,
              );
            } else if (state is AuthorizationEmailPassword) {
              return AuthEmailLoginPage(
                email: state.email,
                isLoading: state.isLoading,
              );
            } else if (state is Authorization2FAVerify) {
              return Auth2FAVerifyPage(
                isLoading: state.isLoading,
                phone: state.phone,
                tempToken: state.tempToken,
              );
            }
            return Container();
          },
        ),
      ),
    );
  }
}
