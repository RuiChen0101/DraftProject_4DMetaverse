export default interface IFile {
    id?: string;
    directoryId?: number;
    name?: string;
    extension?: string;
    mimeType?: string;
    storeLocation?: string;
    supplementData?: { [key: string]: any };
    size?: number;
    permission?: number;
    pathPrefix?: string;
    sha?: string;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}