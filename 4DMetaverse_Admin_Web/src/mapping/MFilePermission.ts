import { EFilePermission } from '4dmetaverse_admin_sdk/storage';

const mFilePermission: { [key: number]: string; } = {};

mFilePermission[EFilePermission.Private] = '非公開';
mFilePermission[EFilePermission.FineGrain] = '個別控制';
mFilePermission[EFilePermission.Public] = '公開';

const filePermissionOptions = [
    { text: '公開', value: EFilePermission.Public },
    { text: '個別控制', value: EFilePermission.FineGrain },
    { text: '非公開', value: EFilePermission.Private },
]

export {
    mFilePermission,
    filePermissionOptions
}