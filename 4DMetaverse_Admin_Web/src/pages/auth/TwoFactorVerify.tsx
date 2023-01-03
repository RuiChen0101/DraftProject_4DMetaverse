import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { getAuth } from '4dmetaverse_admin_sdk/auth';

import './TwoFactorVerify.scss';

import Header from '../../components/headers/Header';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';

interface TwoFactorVerifyState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class TwoFactorVerify extends Component<WithNavigatorProps, TwoFactorVerifyState> {
    private _auth = getAuth();
    private _verifyCode: string = '';
    private _tempToken: string = '';
    private _phone: string = '';

    constructor(props: WithNavigatorProps) {
        super(props);
        this.state = {
            isLoading: true,
            formError: {}
        }
        this._init();
    }

    private _init = async (): Promise<void> => {
        this._phone = this.props.searchParams.get('phone')!;
        this._tempToken = this.props.searchParams.get('tempToken')!;
        await this._auth.sendVerifySms(this._phone, this._tempToken);
        this.setState({
            isLoading: false
        });
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;
        if (!/^[0-9]{6}$/.test(this._verifyCode)) {
            pass = false;
            formError['verifyCode'] = '請輸入6位驗證碼';
        }

        this.setState({
            formError: formError
        });

        return pass;
    }

    private _resend = async (): Promise<void> => {

    }

    private _verify = async (): Promise<void> => {
        if (!this._validate()) return;
        this.setState({
            isLoading: true
        });
        try {
            await this._auth.verify2FA(this._verifyCode, this._tempToken);
            this.props.navigate('/home', { replace: true });
            this.setState({
                isLoading: false
            });
        } catch (_) {
            this.setState({
                isLoading: false,
                errorMessage: "驗證失敗"
            });
        }
    }

    render(): ReactNode {
        return (
            <div className='two-factor-verify-main'>
                <Header />
                {this.state.isLoading ?
                    <div className="min-vh-100 min-vw-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                    :
                    <div className='verify'>
                        <div className='verify-form'>
                            <h3>二階段驗證</h3>
                            <p className="text-start">已傳送六位數簡訊碼至：+{this.props.searchParams.get('phone')}</p>
                            <Form.Group className="mb-3 text-start" controlId="verifyCode">
                                <Form.Label>驗證碼</Form.Label>
                                <Form.Control isInvalid={!!this.state.formError.verifyCode} type="text" placeholder="Verify code" onChange={(e) => this._verifyCode = e.target.value} />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.formError.verifyCode}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {this.state.errorMessage !== undefined && <span className='error mb-3'>
                                {this.state.errorMessage}
                            </span>}
                            <Button onClick={this._verify}>
                                登入
                            </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withNavigator(TwoFactorVerify);