import { IPreviewCollection } from './ICollection';

export default interface ISalePlan {
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