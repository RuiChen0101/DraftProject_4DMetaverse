export interface IDirectory {
    id?: number;
    parentDirId?: number;
    pathPrefix?: string;
    name?: string;
    isLocked?: boolean;
}

export interface IFile {
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
    publicUrl?: string;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
}