export default interface ILoginDevice {
    id?: string;
    userId?: string;
    deviceType?: number;
    firebaseToken?: string;
    osVersion?: string;
    modelName?: string;
    deviceId?: string;
    createAt?: string;
    refreshAt?: string;
}