import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import { EUserRole, getUser } from '4dmetaverse_admin_sdk/user';

import { DialogShareProp } from '../base/DialogBase';
import { userRoleOptions } from '../../../mapping/MUserRole';
import SelectOptionsBuilder from '../../form/SelectOptionsBuilder';
import StandardDialogTemplate from '../template/StandardDialogTemplate';

interface UserCreateProp extends DialogShareProp {
    onSuccess: (id: string) => void;
}

interface UserCreateState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class UserCreateDialog extends Component<UserCreateProp, UserCreateState> {
    private _name: string = "";
    private _email: string = "";
    private _password: string = "";
    private _role: number = EUserRole.Customer;
    constructor(prop: UserCreateProp) {
        super(prop);
        this.state = {
            isLoading: false,
            formError: {}
        }
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;
        if (this._email === '') {
            pass = false;
            formError['email'] = '請輸入Email';
        } else if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(this._email)) {
            pass = false;
            formError['email'] = 'Email格式不符';
        }

        if (this._password === '') {
            pass = false;
            formError['password'] = '請輸入密碼';
        }

        if (this._name === '') {
            pass = false;
            formError['name'] = '請輸入用戶名稱';
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
            const id = await getUser().create({
                name: this._name,
                email: this._email,
                password: this._password,
                role: this._role
            });
            this.props.onSuccess(id);
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
                title="建立用戶"
                closeText="取消"
                successText="建立"
            >
                <div className="d-flex justify-content-between mb-3">
                    <Form.Group className="me-1 flex-fill-equal" controlId="createEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control isInvalid={!!this.state.formError.email} disabled={this.state.isLoading} type="email" placeholder="Email" onChange={(e) => this._email = e.target.value} />
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="ms-1 flex-fill-equal" controlId="createName">
                        <Form.Label>用戶名稱</Form.Label>
                        <Form.Control isInvalid={!!this.state.formError.name} disabled={this.state.isLoading} placeholder="名稱" onChange={(e) => this._name = e.target.value} />
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <Form.Group className="mb-3" controlId="createPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control isInvalid={!!this.state.formError.password} disabled={this.state.isLoading} type="password" placeholder="Password" onChange={(e) => this._password = e.target.value} />
                    <Form.Control.Feedback type="invalid">
                        {this.state.formError.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="createRole">
                    <Form.Label>角色</Form.Label>
                    <Form.Select disabled={this.state.isLoading} onChange={(e) => this._role = parseInt(e.target.value)}>
                        <SelectOptionsBuilder data={userRoleOptions} />
                    </Form.Select>
                </Form.Group>
            </StandardDialogTemplate>
        )
    }
}

export default UserCreateDialog;