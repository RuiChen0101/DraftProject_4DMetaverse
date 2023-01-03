part of 'enable_2fa_bloc.dart';

abstract class Enable2FAState extends Equatable {
  final bool isLoading;
  final String? errorMessage;
  const Enable2FAState(this.isLoading, this.errorMessage);

  @override
  List<Object> get props => [isLoading, errorMessage ?? ""];
}

class Enable2FAToHome extends Enable2FAState {
  const Enable2FAToHome() : super(false, null);
}

class Enable2FAPhone extends Enable2FAState {
  const Enable2FAPhone(super.isLoading, super.errorMessage);

  @override
  List<Object> get props => [isLoading, errorMessage ?? ""];
}

class Enable2FAVerify extends Enable2FAState {
  final String phone;
  const Enable2FAVerify(super.isLoading, super.errorMessage, this.phone);

  @override
  List<Object> get props => [isLoading, errorMessage ?? "", phone];
}
