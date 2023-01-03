import { EFilePermission, getStorage } from '4dmetaverse_admin_sdk/storage';
import { Component, ReactNode } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { filePermissionOptions } from '../../../mapping/MFilePermission';
import SelectOptionsBuilder from '../../form/SelectOptionsBuilder';
import { DialogShareProp } from '../base/DialogBase';
import StandardDialogTemplate from '../template/StandardDialogTemplate';

interface UploadFileDialogProp extends DialogShareProp {
    pathPrefix: string;
    onSuccess: () => void;
}

interface UploadFileDialogState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class UploadFileDialog extends Component<UploadFileDialogProp, UploadFileDialogState>{
    private _permission: number = EFilePermission.Private;
    private _file: File | null = null;

    constructor(prop: UploadFileDialogProp) {
        super(prop);
        this.state = {
            isLoading: false,
            formError: {}
        }
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;

        if (this._file === null) {
            formError['file'] = '請選擇檔案';
            pass = false;
        }

        this.setState({
            formError: formError
        });

        return pass;
    }

    private _onUpload = async (): Promise<void> => {
        if (!(this._validate())) return;
        this.setState({
            isLoading: true
        });
        try {
            await getStorage().upload({
                path: this.props.pathPrefix,
                file: this._file!,
                permission: this._permission
            });
            this.props.onSuccess();
            this.props.onClose();
        } catch (e: any) {
            this.setState({
                errorMessage: e.message,
            });
        } finally {
            this.setState({
                isLoading: false
            });
        }
    }

    render(): ReactNode {
        return (
            <StandardDialogTemplate
                isLoading={this.state.isLoading}
                errorMessage={this.state.errorMessage}
                onClose={this.props.onClose}
                onSuccess={this._onUpload}
                title="新增資料夾"
                closeText="取消"
                successText="新增"
            >
                <div className="d-flex justify-content-between mb-3">
                    <Form.Group className="me-1 flex-fill-equal" controlId="displayPathPrefix">
                        <Form.Label>儲存路徑</Form.Label>
                        <Form.Control disabled={true} value={'/' + this.props.pathPrefix} />
                    </Form.Group>
                    <Form.Group className="ms-1 flex-fill-equal" controlId="createPermission">
                        <Form.Label>存取權限</Form.Label>
                        <Form.Select disabled={this.state.isLoading} onChange={(e) => this._permission = parseInt(e.target.value)}>
                            <SelectOptionsBuilder data={filePermissionOptions} />
                        </Form.Select>
                    </Form.Group>
                </div>
                <Form.Group className="mb-3 text-start" controlId="createFile">
                    <Form.Label>檔案</Form.Label>
                    <Form.Control
                        isInvalid={!!this.state.formError.file}
                        disabled={this.state.isLoading}
                        type="file"
                        onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                this._file = e.target.files === null ? null : e.target.files[0];
                            }
                        }
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.formError.file}
                    </Form.Control.Feedback>
                </Form.Group>
            </StandardDialogTemplate>
        );
    }
}

export default UploadFileDialog;