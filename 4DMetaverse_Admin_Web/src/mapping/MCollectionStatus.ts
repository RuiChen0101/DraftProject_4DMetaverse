import { ECollectionStatus } from '4dmetaverse_admin_sdk/collection';

const mCollectionStatus: { [key: number]: string; } = {};

mCollectionStatus[ECollectionStatus.Deleted] = '刪除';
mCollectionStatus[ECollectionStatus.Hidden] = '隱藏';
mCollectionStatus[ECollectionStatus.Normal] = '正常';

const collectionStatusOptions = [
    { text: '正常', value: ECollectionStatus.Normal },
    { text: '隱藏', value: ECollectionStatus.Hidden },
    { text: '刪除', value: ECollectionStatus.Deleted },
]

export {
    mCollectionStatus,
    collectionStatusOptions
}