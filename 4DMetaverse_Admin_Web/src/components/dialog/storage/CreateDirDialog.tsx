import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import { DialogShareProp } from '../base/DialogBase';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { getStorage } from '4dmetaverse_admin_sdk/storage';

import StandardDialogTemplate from '../template/StandardDialogTemplate';

interface CreateDirDialogProp extends DialogShareProp {
    path: string;
    onSuccess: () => void;
}

interface CreateDirDialogState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class CreateDirDialog extends Component<CreateDirDialogProp, CreateDirDialogState>{
    private _dirName: string = "";

    constructor(prop: CreateDirDialogProp) {
        super(prop);
        this.state = {
            isLoading: false,
            formError: {}
        }
    }

    private _buildPathPrefix = (): string => {
        const { path } = this.props;
        if (path === '') {
            return '/';
        }
        return `/${path}/`;
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;

        if (this._dirName === '') {
            formError['dirName'] = '請輸入資料夾名稱';
            pass = false;
        } else if (this._dirName.includes('/')) {
            formError['dirName'] = '資料夾名稱不能包含"/"';
            pass = false;
        }

        this.setState({
            formError: formError
        });

        return pass;
    }

    private _onCreate = async (): Promise<void> => {
        if (!(this._validate())) return;
        this.setState({
            isLoading: true
        });
        try {
            await getStorage().ensurePath(`${this.props.path}/${this._dirName}`);
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
                onSuccess={this._onCreate}
                title="新增資料夾"
                closeText="取消"
                successText="新增"
            >
                <Form.Group className="text-start" controlId="createDirName">
                    <Form.Label>資料夾名稱</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            {this._buildPathPrefix()}
                        </InputGroup.Text>
                        <Form.Control isInvalid={!!this.state.formError.dirName} disabled={this.state.isLoading} placeholder="資料夾名稱" onChange={(e) => this._dirName = e.target.value} />
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.dirName}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </StandardDialogTemplate>
        );
    }
}

export default CreateDirDialog;