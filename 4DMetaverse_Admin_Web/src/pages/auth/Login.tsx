import { Navigate } from 'react-router-dom';
import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { getAuth } from '4dmetaverse_admin_sdk/auth';

import './Login.scss';

import Header from '../../components/headers/Header';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';

interface LoginState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class Login extends Component<WithNavigatorProps, LoginState> {
    private _auth = getAuth();
    private _email: string = '';
    private _password: string = '';

    constructor(prop: WithNavigatorProps) {
        super(prop);
        this.state = {
            isLoading: false,
            formError: {}
        };
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

        this.setState({
            formError: formError
        });

        return pass;
    }

    private _login = async (): Promise<void> => {
        if (!this._validate()) return;
        this.setState({
            isLoading: true
        });
        try {
            const data = await this._auth.loginWithEmail(this._email, this._password);
            if (data === undefined) {
                this.props.navigate('/home', { replace: true });
            } else {
                this.props.navigate(`/2fa_verify?phone=${data['phone']}&tempToken=${data['tempToken']}`);
            }
            this.setState({
                isLoading: false
            });
        } catch (_) {
            this.setState({
                isLoading: false,
                errorMessage: "登入失敗，請檢查帳號密碼"
            });
        }
    }

    render(): ReactNode {
        if (this._auth.accessTokenData !== undefined) {
            return (<Navigate replace to="/home" />);
        }
        return (
            <div className='login-main'>
                <Header />
                {this.state.isLoading ?
                    <div className="min-vh-100 min-vw-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                    :
                    <div className='login'>
                        <div className='login-form'>
                            <h3>登入</h3>
                            <Form.Group className="mb-3 text-start" controlId="loginEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control isInvalid={!!this.state.formError.email} type="email" placeholder="Email" onChange={(e) => this._email = e.target.value} />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.formError.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 text-start" controlId="loginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control isInvalid={!!this.state.formError.password} type="password" placeholder="Password" onChange={(e) => this._password = e.target.value} />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.formError.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {this.state.errorMessage !== undefined && <span className='error mb-3'>
                                {this.state.errorMessage}
                            </span>}
                            <Button onClick={this._login}>
                                登入
                            </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withNavigator(Login);