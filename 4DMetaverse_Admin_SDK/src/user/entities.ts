export interface IWeb3Wallet {
    id?: number;
    userId?: string;
    type?: string;
    address?: string;
    nonce?: string;
    createAt?: string;
}

export interface IUser {
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