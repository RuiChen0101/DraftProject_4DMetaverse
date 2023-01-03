part of 'authorization_bloc.dart';

abstract class AuthorizationState extends Equatable {
  final bool isLoading;
  final String? errorMessage;
  const AuthorizationState(this.isLoading, this.errorMessage);

  @override
  List<Object> get props => [];
}

class AuthorizationToHome extends AuthorizationState {
  const AuthorizationToHome() : super(false, null);
}

class AuthorizationToEnable2FA extends AuthorizationState {
  const AuthorizationToEnable2FA() : super(false, null);
}

class AuthorizationEntry extends AuthorizationState {
  const AuthorizationEntry(super.isLoading, super.errorMessage);

  @override
  List<Object> get props => [isLoading, errorMessage ?? ""];
}

class AuthorizationEmailRegistration extends AuthorizationState {
  final String email;
  const AuthorizationEmailRegistration(
      super.isLoading, super.errorMessage, this.email);

  @override
  List<Object> get props => [email, isLoading, errorMessage ?? ""];
}

class AuthorizationEmailPassword extends AuthorizationState {
  final String email;
  const AuthorizationEmailPassword(
      super.isLoading, super.errorMessage, this.email);

  @override
  List<Object> get props => [email, isLoading, errorMessage ?? ""];
}

class Authorization2FAVerify extends AuthorizationState {
  final String phone;
  final String tempToken;
  const Authorization2FAVerify(
      super.isLoading, super.errorMessage, this.phone, this.tempToken);

  @override
  List<Object> get props => [phone, tempToken, isLoading, errorMessage ?? ""];
}
