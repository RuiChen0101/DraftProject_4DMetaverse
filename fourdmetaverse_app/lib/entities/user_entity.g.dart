// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserEntity _$UserEntityFromJson(Map<String, dynamic> json) => UserEntity()
  ..id = json['id'] as String?
  ..name = json['name'] as String?
  ..email = json['email'] as String?
  ..phone = json['phone'] as String?
  ..role = json['role'] as int?
  ..flag = json['flag'] as int?
  ..status = json['status'] as int?;

Map<String, dynamic> _$UserEntityToJson(UserEntity instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'role': instance.role,
      'flag': instance.flag,
      'status': instance.status,
    };
