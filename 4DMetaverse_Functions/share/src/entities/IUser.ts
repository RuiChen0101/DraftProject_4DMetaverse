import IWeb3Wallet from "./IWeb3Wallet";

export default interface IUser {
    wallet?: IWeb3Wallet[];
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    loginMethods?: number;
    phone?: string;
    role?: number;
    flag?: number;
    status?: number;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}