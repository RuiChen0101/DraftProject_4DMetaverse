import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EDirectoryLock, getStorage, IDirectory } from '4dmetaverse_admin_sdk/storage';

import './DirectoryDetail.scss';

import AsyncButton from '../../components/AsyncButton';
import GenericDatetimeCell from '../../components/cells/GenericDatetimeCell';
import { showDialog } from '../../components/dialog/base/DialogBase';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';

interface DirectoryDetailProp {
    onRefresh: () => void;
    dir: IDirectory;
}

interface DirectoryDetailState {
    isLocked: boolean;
}

class DirectoryDetail extends Component<DirectoryDetailProp, DirectoryDetailState> {

    constructor(prop: DirectoryDetailProp) {
        super(prop);
        this.state = {
            isLocked: (this.props.dir.isLocked ?? -1) === EDirectoryLock.Locked
        }
    }

    private _onLockChange = (value: boolean): void => {
        this.setState({
            isLocked: value
        })
    }

    private _onLockSave = async (): Promise<void> => {
        await getStorage().updateDirLocking(
            this.props.dir.id!,
            this.state.isLocked ? EDirectoryLock.Locked : EDirectoryLock.Unlocked
        );
        this.props.onRefresh();
    }

    private _onDelete = (): void => {
        const { dir } = this.props;
        showDialog((close: () => void): ReactNode => {
            return (
                <ConfirmDialog
                    text={`確認刪除資料夾: ${dir.name}`}
                    onClose={close}
                    onConfirm={async (): Promise<void> => {
                        await getStorage().deleteDir(dir.id!);
                        this.props.onRefresh();
                    }}
                />
            )
        });
    }

    render(): ReactNode {
        return (
            <div className="directory-detail">
                <div className="directory-detail-header d-flex align-items-center mb-3">
                    <FontAwesomeIcon className="me-2" width={28} icon={faFolder} />
                    <p className='px-2'>{this.props.dir.name}</p>
                    <Button
                        disabled={this.state.isLocked}
                        variant="link"
                        className="directory-delete p-1 ms-auto"
                        onClick={this._onDelete}
                    >
                        <FontAwesomeIcon width={28} icon={faTrash} />
                    </Button>
                </div>
                <div className="directory-detail-info">
                    <p className="directory-detail-info-headline">建立日期</p>
                    <p className="mb-2"><GenericDatetimeCell dateTime={this.props.dir.createAt ?? ''} /></p>

                    <div className="d-flex align-items-center mb-3">
                        <span>鎖定</span>
                        <Form.Check
                            className='ms-auto'
                            type="checkbox"
                            checked={this.state.isLocked}
                            onChange={(e) => this._onLockChange(e.target.checked)}
                        />
                    </div>
                    <div className="d-flex align-items-center">
                        <AsyncButton
                            variant="primary"
                            className="ms-auto"
                            onClick={this._onLockSave}
                        >
                            <span>儲存</span>
                        </AsyncButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default DirectoryDetail;