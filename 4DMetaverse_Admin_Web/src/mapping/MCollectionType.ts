import { ECollectionType } from '4dmetaverse_admin_sdk/collection';

const mCollectionType: { [key: number]: string; } = {};

mCollectionType[ECollectionType.Text] = '文字';
mCollectionType[ECollectionType.Image] = '圖片';
mCollectionType[ECollectionType.Audio] = '音訊';
mCollectionType[ECollectionType.Video] = '影片';
mCollectionType[ECollectionType.Modal3D] = '3D模型';
mCollectionType[ECollectionType.Modal4D] = '4D模型';
mCollectionType[ECollectionType.RealProduct] = '實體商品';
mCollectionType[ECollectionType.NFT] = 'NFT';

const collectionTypeOptions = [
    { text: '文字', value: ECollectionType.Text },
    { text: '圖片', value: ECollectionType.Image },
    { text: '音訊', value: ECollectionType.Audio },
    { text: '影片', value: ECollectionType.Video },
    { text: '3D模型', value: ECollectionType.Modal3D },
    { text: '4D模型', value: ECollectionType.Modal4D },
    { text: '實體商品', value: ECollectionType.RealProduct },
    { text: 'NFT', value: ECollectionType.NFT },
]

export {
    mCollectionType,
    collectionTypeOptions
}