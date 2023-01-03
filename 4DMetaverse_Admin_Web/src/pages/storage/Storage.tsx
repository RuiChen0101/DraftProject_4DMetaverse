import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStorage, IDirectory, IFile } from '4dmetaverse_admin_sdk/storage';
import {
    faLink,
    faUpload,
    faFolderPlus
} from '@fortawesome/free-solid-svg-icons';

import './Storage.scss';

import FileDetail from '../../section/storage/FileDetail';
import FileListTable from '../../components/table/FileListTable';
import DirectoryDetail from '../../section/storage/DirectoryDetail';
import { showDialog } from '../../components/dialog/base/DialogBase';
import CreateDirDialog from '../../components/dialog/storage/CreateDirDialog';
import UploadFileDialog from '../../components/dialog/storage/UploadFileDialog';

interface StorageState {
    isLoading: boolean;
    currentPath: string[];
    dirs: IDirectory[];
    files: IFile[];
    detailComponent: ReactNode;
}

class Storage extends Component<any, StorageState> {

    constructor(prop: any) {
        super(prop);
        this.state = {
            isLoading: true,
            dirs: [],
            files: [],
            currentPath: [],
            detailComponent: (<></>)
        }
    }

    async componentDidMount(): Promise<void> {
        const result = await getStorage().listDirByPath('')
        this.setState({
            dirs: result.dirs,
            files: result.files,
            isLoading: false
        });
    }

    private _onBack = async (): Promise<void> => {
        const path = this.state.currentPath.slice(0, -1);
        this.setState({
            currentPath: path,
            isLoading: true
        });
        const result = await getStorage().listDirByPath(path.join('/'));
        this.setState({
            dirs: result.dirs,
            files: result.files,
            isLoading: false,
        });
    }

    private _onNav = async (name: string): Promise<void> => {
        const path = [...this.state.currentPath, name];
        this.setState({
            currentPath: path,
            isLoading: true
        });
        const result = await getStorage().listDirByPath(path.join('/'));
        this.setState({
            dirs: result.dirs,
            files: result.files,
            isLoading: false,
        });
    }

    private _refresh = async (): Promise<void> => {
        this.setState({
            isLoading: true
        });
        const result = await getStorage().listDirByPath(this.state.currentPath.join('/'));
        this.setState({
            dirs: result.dirs,
            files: result.files,
            isLoading: false,
            detailComponent: (<></>)
        });
    }

    private _onDirClick = (dir: IDirectory): void => {
        this.setState({
            detailComponent: (<DirectoryDetail key={dir.id} dir={dir} onRefresh={this._refresh} />)
        });
    }

    private _onFileClick = (file: IFile): void => {
        this.setState({
            detailComponent: (<FileDetail key={file.id} file={file} onRefresh={this._refresh} />)
        });
    }

    private _onDirCreateClick = (): void => {
        showDialog((close: () => void): ReactNode => {
            return (
                <CreateDirDialog
                    onSuccess={this._refresh}
                    onClose={close}
                    path={this.state.currentPath.join('/')}
                />
            )
        });
    }

    private _onFileCreateClick = (): void => {
        showDialog((close: () => void): ReactNode => {
            return (
                <UploadFileDialog
                    onSuccess={this._refresh}
                    onClose={close}
                    pathPrefix={this.state.currentPath.join('/')}
                />
            )
        });
    }

    render(): ReactNode {
        return (
            <div className="storage">
                <h1 className="mb-5">檔案管理</h1>
                <div className="storage-area">
                    <div className="storage-header">
                        <div className="storage-current-path">
                            <FontAwesomeIcon className="me-2" width={28} icon={faLink} />
                            <p>{'/' + this.state.currentPath.join('/')}</p>
                        </div>
                        <div className="px-2 ms-auto d-flex align-items-center">
                            <Button
                                variant="link"
                                className="p-1 me-2"
                                onClick={this._onDirCreateClick}
                            >
                                <FontAwesomeIcon width={24} icon={faFolderPlus} />
                            </Button>
                            <Button
                                disabled={this.state.currentPath.length === 0}
                                variant="link"
                                className="p-1"
                                onClick={this._onFileCreateClick}
                            >
                                <FontAwesomeIcon width={24} icon={faUpload} />
                            </Button>
                        </div>
                    </div>
                    <div className="storage-body">
                        <div className="container-fluid p-0">
                            <div className="row">
                                <div className="storage-file-list pb-1 col-12 col-md-9 order-2 order-md-1">
                                    <FileListTable
                                        dirs={this.state.dirs}
                                        files={this.state.files}
                                        isLoading={this.state.isLoading}
                                        onNav={this._onNav}
                                        onBack={this._onBack}
                                        onDirClick={this._onDirClick}
                                        onFileClick={this._onFileClick}
                                    />
                                </div>
                                <div className="col-12 col-md-3 order-1 order-md-2">
                                    <div className="storage-file-detail w-100">
                                        {this.state.detailComponent}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Storage;