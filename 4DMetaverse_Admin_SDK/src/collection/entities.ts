export interface IShopGroup {
    id?: string;
    title?: string;
    tags?: string[];
    coverImageUrl?: string;
    status?: number;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}

export interface IShop {
    defaultSalePlan?: ISalePlan;
    id?: string;
    groupId?: string;
    title?: string;
    description?: string;
    coverImageUrl?: string;
    status?: number;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}

export interface ISalePlan {
    previewCollection?: IPreviewCollection[];
    id?: string;
    shopId?: string;
    name?: string;
    price?: number;
    status?: number;
    isDefault?: boolean;
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

export interface ICollection {
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