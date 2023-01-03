export default interface IDirectory {
    id?: number;
    parentDirId?: number;
    pathPrefix?: string;
    name?: string;
    isLocked?: boolean;
}