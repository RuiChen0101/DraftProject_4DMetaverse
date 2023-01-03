export default interface IAuth {
    id: string;
    name: string;
    type: number;
    allow: string[];
    role: number;
    flag: number;
    status: number;
    nonce: string;
    exp: number;
}