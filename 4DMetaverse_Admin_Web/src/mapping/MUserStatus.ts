import { EUserStatus } from '4dmetaverse_admin_sdk/user';

const mUserStatus: { [key: number]: string; } = {};

mUserStatus[EUserStatus.Active] = '正常';
mUserStatus[EUserStatus.Blocked] = '凍結';
mUserStatus[EUserStatus.Deleted] = '刪除';

const userStatusOptions = [
    { text: '正常', value: EUserStatus.Active },
    { text: '凍結', value: EUserStatus.Blocked },
    { text: '刪除', value: EUserStatus.Deleted }
]

export {
    mUserStatus,
    userStatusOptions
}