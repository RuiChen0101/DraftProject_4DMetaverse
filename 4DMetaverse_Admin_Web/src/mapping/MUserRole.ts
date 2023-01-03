import { EUserRole } from '4dmetaverse_admin_sdk/user';

const mUserRole: { [key: number]: string; } = {};

mUserRole[EUserRole.Customer] = '用戶';
mUserRole[EUserRole.Admin] = '管理員';

const userRoleOptions = [
    { text: '用戶', value: EUserRole.Customer },
    { text: '管理員', value: EUserRole.Admin }
]

export {
    mUserRole,
    userRoleOptions
}