part of 'enable_2fa_bloc.dart';

abstract class Enable2FAEvent extends Equatable {
  const Enable2FAEvent();

  @override
  List<Object> get props => [];
}

class Enable2FAPhoneEnter extends Enable2FAEvent {
  final String phone;
  const Enable2FAPhoneEnter(this.phone);

  @override
  List<Object> get props => [phone];
}

class Enable2FAVerifyCodeResend extends Enable2FAEvent {
  const Enable2FAVerifyCodeResend();
}

class Enable2FAVerifyCodeEnter extends Enable2FAEvent {
  final String verifyCode;
  const Enable2FAVerifyCodeEnter(this.verifyCode);

  @override
  List<Object> get props => [verifyCode];
}
