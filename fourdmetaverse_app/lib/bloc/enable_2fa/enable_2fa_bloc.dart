import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fourdmetaverse_app/backend/user/user.dart';

part 'enable_2fa_event.dart';
part 'enable_2fa_state.dart';

class Enable2FABloc extends Bloc<Enable2FAEvent, Enable2FAState> {
  String _phone = "";
  Enable2FABloc() : super(const Enable2FAPhone(false, null)) {
    on<Enable2FAPhoneEnter>((event, emit) => _onPhoneEnter(emit, event.phone));
    on<Enable2FAVerifyCodeEnter>(
      (event, emit) => _onVerifyCodeEnter(emit, event.verifyCode),
    );
    on<Enable2FAVerifyCodeResend>((event, emit) => _onResend(emit));
  }

  void _onPhoneEnter(Emitter emit, String phone) async {
    emit(const Enable2FAPhone(true, null));
    try {
      _phone = phone;
      if (_phone.startsWith("+")) {
        _phone = _phone.substring(1);
      }
      await User.I.sendVerifySms(_phone);
      emit(Enable2FAVerify(false, null, _phone));
    } catch (_) {
      emit(const Enable2FAPhone(false, "發送驗證簡訊失敗"));
    }
  }

  void _onVerifyCodeEnter(Emitter emit, String verifyCode) async {
    emit(Enable2FAVerify(true, null, _phone));
    try {
      await User.I.enable2FA(_phone, verifyCode);
      emit(const Enable2FAToHome());
    } catch (_) {
      emit(Enable2FAVerify(false, "驗證失敗", _phone));
    }
  }

  void _onResend(Emitter emit) async {
    emit(Enable2FAVerify(true, null, _phone));
    try {
      await User.I.sendVerifySms(_phone);
      emit(Enable2FAVerify(false, null, _phone));
    } catch (_) {
      emit(Enable2FAVerify(false, "重新發送驗證簡訊失敗", _phone));
    }
  }
}
