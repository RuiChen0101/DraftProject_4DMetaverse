import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fourdmetaverse_app/backend/auth/auth.dart';
import 'package:fourdmetaverse_app/backend/user/user.dart';

part 'authorization_event.dart';
part 'authorization_state.dart';

class AuthorizationBloc extends Bloc<AuthorizationEvent, AuthorizationState> {
  AuthorizationBloc() : super(const AuthorizationEntry(false, null)) {
    on<AuthorizationReturn>((event, emit) => _onReturn(emit));
    on<AuthorizationEmailEnter>(
        (event, emit) => _onEmailEnter(emit, event.email));
    on<AuthorizationEmailCreate>(
      (event, emit) =>
          _onEmailCreate(emit, event.email, event.name, event.password),
    );
    on<AuthorizationEmailLogin>(
      (event, emit) => _onEmailLogin(emit, event.email, event.password),
    );
    on<AuthorizationVerifyCodeResend>(
      (event, emit) => _onVerifyCodeResend(emit, event.phone, event.tempToken),
    );
    on<AuthorizationVerifyCodeEnter>(
      (event, emit) => _onVerifyCodeEnter(
          emit, event.phone, event.verifyCode, event.tempToken),
    );
  }

  void _onReturn(Emitter emit) async {
    emit(const AuthorizationEntry(false, null));
  }

  void _onEmailEnter(Emitter emit, String email) async {
    emit(const AuthorizationEntry(true, null));
    if (await User.I.checkEmail(email)) {
      emit(AuthorizationEmailPassword(false, null, email));
    } else {
      emit(AuthorizationEmailRegistration(false, null, email));
    }
  }

  void _onEmailCreate(
      Emitter emit, String email, String name, String password) async {
    emit(AuthorizationEmailRegistration(true, null, email));
    try {
      await User.I.createByEmail(name: name, email: email, password: password);
      await Auth.I.loginWithEmail(email, password);
      emit(const AuthorizationToEnable2FA());
    } catch (_) {
      emit(AuthorizationEmailRegistration(false, "建立失敗", email));
    }
  }

  void _onEmailLogin(Emitter emit, String email, String password) async {
    emit(AuthorizationEmailPassword(true, null, email));
    try {
      Auth auth = Auth.I;
      Map<String, dynamic> data = await auth.loginWithEmail(email, password);
      if (data.containsKey("phone")) {
        await auth.sendVerifySms(data['phone'], data['tempToken']);
        emit(Authorization2FAVerify(
            false, null, data['phone'], data['tempToken']));
        return;
      }
      emit(const AuthorizationToHome());
    } catch (_) {
      emit(AuthorizationEmailPassword(false, "登入失敗", email));
    }
  }

  void _onVerifyCodeResend(Emitter emit, String phone, String tempToken) async {
    emit(Authorization2FAVerify(true, null, phone, tempToken));
    try {
      await Auth.I.sendVerifySms(phone, tempToken);
      emit(Authorization2FAVerify(false, null, phone, tempToken));
    } catch (_) {
      emit(Authorization2FAVerify(false, "重送失敗", phone, tempToken));
    }
  }

  void _onVerifyCodeEnter(
      Emitter emit, String phone, String verifyCode, String tempToken) async {
    emit(Authorization2FAVerify(true, null, phone, tempToken));
    try {
      await Auth.I.verify2FA(verifyCode, tempToken);
      emit(const AuthorizationToHome());
    } catch (_) {
      emit(Authorization2FAVerify(false, "驗證失敗", phone, tempToken));
    }
  }
}
