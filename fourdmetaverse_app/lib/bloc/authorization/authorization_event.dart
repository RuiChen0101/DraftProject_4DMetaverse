part of 'authorization_bloc.dart';

abstract class AuthorizationEvent extends Equatable {
  const AuthorizationEvent();

  @override
  List<Object> get props => [];
}

class AuthorizationReturn extends AuthorizationEvent {}

class AuthorizationEmailEnter extends AuthorizationEvent {
  final String email;

  const AuthorizationEmailEnter(this.email);

  @override
  List<Object> get props => [email];
}

class AuthorizationEmailCreate extends AuthorizationEvent {
  final String email;
  final String name;
  final String password;

  const AuthorizationEmailCreate(this.email, this.name, this.password);

  @override
  List<Object> get props => [email, name, password];
}

class AuthorizationEmailLogin extends AuthorizationEvent {
  final String email;
  final String password;

  const AuthorizationEmailLogin(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class AuthorizationVerifyCodeResend extends AuthorizationEvent {
  final String phone;
  final String tempToken;

  const AuthorizationVerifyCodeResend(this.phone, this.tempToken);

  @override
  List<Object> get props => [phone, tempToken];
}

class AuthorizationVerifyCodeEnter extends AuthorizationEvent {
  final String phone;
  final String verifyCode;
  final String tempToken;

  const AuthorizationVerifyCodeEnter(
      this.phone, this.verifyCode, this.tempToken);

  @override
  List<Object> get props => [phone, verifyCode, tempToken];
}
