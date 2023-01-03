import ISalePlan from "./ISalePlan";

export default interface IShop {
    defaultSalePlan?: ISalePlan;
    id?: string;
    seriesId?: string;
    title?: string;
    description?: string;
    coverImageUrl?: string;
    status?: number;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}