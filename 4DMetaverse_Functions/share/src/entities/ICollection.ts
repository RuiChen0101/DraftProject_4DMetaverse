export default interface ICollection {
    id?: string;
    collectionPoolId?: number;
    title?: string;
    type?: number;
    previewImageUrl?: string;
    unlockedImageUrl?: string;
    mediaUrl?: string;
    data?: { [key: string]: any };
    status?: number;
    available?: number;
    totalUnlocked?: number;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}

export interface IPreviewCollection {
    id?: string;
    title?: string;
    type?: number;
    previewImageUrl?: string;
    available?: number;
    totalUnlocked?: number;
}