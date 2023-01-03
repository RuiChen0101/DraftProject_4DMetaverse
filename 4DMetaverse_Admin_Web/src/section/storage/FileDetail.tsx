import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Accordion from 'react-bootstrap/esm/Accordion';
import { getStorage, IFile } from '4dmetaverse_admin_sdk/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';

import './FileDetail.scss';

import ProtectedImage from '../../components/ProtectedImage';
import { mFilePermission } from '../../mapping/MFilePermission';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { showDialog } from '../../components/dialog/base/DialogBase';
import GenericDatetimeCell from '../../components/cells/GenericDatetimeCell';

interface FileDetailProp {
    file: IFile;
    onRefresh: () => void;
}

class FileDetail extends Component<FileDetailProp> {
    private _canPreview = (mimeType: string): boolean => {
        return /image\/.+/.test(mimeType);
    }

    private _onDelete = (): void => {
        const { file } = this.props;
        showDialog((close: () => void): ReactNode => {
            return (
                <ConfirmDialog
                    text={`確認刪除檔案: ${file.name}`}
                    onClose={close}
                    onConfirm={async (): Promise<void> => {
                        await getStorage().deleteFile(file.id!);
                        this.props.onRefresh();
                    }}
                />
            )
        });
    }

    render(): ReactNode {
        return (
            <div className="file-detail">
                <div className="file-detail-header d-flex align-items-center mb-3">
                    <FontAwesomeIcon className="me-2" width={28} icon={faFile} />
                    <p className='px-2'>{this.props.file.name}</p>
                    <Button
                        variant="link"
                        className="file-delete p-1 ms-auto"
                        onClick={this._onDelete}
                    >
                        <FontAwesomeIcon width={28} icon={faTrash} />
                    </Button>
                </div>

                <div className="mb-4 d-flex justify-content-center">
                    {this._canPreview(this.props.file.mimeType ?? '') &&
                        (<ProtectedImage className='file-detail-preview-image' src={this.props.file.publicUrl ?? ''} />)}
                </div>

                <div className="file-detail-info mb-3">
                    <p className="file-detail-info-headline">名稱</p>
                    <p className="mb-2">{this.props.file.name + '.' + this.props.file.extension}</p>

                    <p className="file-detail-info-headline">大小</p>
                    <p className="mb-2">{this.props.file.size?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'Bytes'}</p>

                    <p className="file-detail-info-headline">類型</p>
                    <p className="mb-2">{this.props.file.mimeType}</p>

                    <p className="file-detail-info-headline">存取控制</p>
                    <p className="mb-2">{mFilePermission[this.props.file.permission ?? 1]}</p>

                    <p className="file-detail-info-headline">建立日期</p>
                    <p className="mb-2"><GenericDatetimeCell dateTime={this.props.file.createAt ?? ''} /></p>

                    <p className="file-detail-info-headline">修改日期</p>
                    <p className="mb-2"><GenericDatetimeCell dateTime={this.props.file.updateAt ?? ''} /></p>

                    <div className="d-flex">
                        <p className="file-detail-info-headline me-1">公開連結</p>
                        <FontAwesomeIcon
                            className="file-detail-info-copy-url"
                            width={14}
                            icon={faCopy}
                            onClick={() => { navigator.clipboard.writeText(this.props.file.publicUrl ?? '') }}
                        />
                    </div>
                    <p><a href={this.props.file.publicUrl} target="_blank" rel="noopener noreferrer">{this.props.file.publicUrl}</a></p>
                </div>
                <Accordion className="file-detail-info-metadata">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>中繼資料</Accordion.Header>
                        <Accordion.Body>
                            <pre>
                                {JSON.stringify(this.props.file.supplementData ?? '{}', undefined, 2)}
                            </pre>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }
}

export default FileDetail;