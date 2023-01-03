import { Component, ReactNode } from 'react';
import { Spinner, Button } from 'react-bootstrap';

import './ConfirmDialog.scss';

import DialogBody from './base/DialogBody';
import DialogFooter from './base/DialogFooter';
import { DialogShareProp } from './base/DialogBase';

interface ConfirmDialogProp extends DialogShareProp {
    onConfirm: () => Promise<void>;
    text?: string;
}

interface ConfirmDialogState {
    isLoading: boolean;
    errorMessage?: string;
}

class ConfirmDialog extends Component<ConfirmDialogProp, ConfirmDialogState>{
    constructor(prop: ConfirmDialogProp) {
        super(prop);
        this.state = {
            isLoading: false
        }
    }

    private _onConfirm = async (): Promise<void> => {
        this.setState({ isLoading: true });
        try {
            await this.props.onConfirm();
            this.props.onClose();
        } catch (e: any) {
            this.setState({
                isLoading: false,
                errorMessage: e.message
            });
        }
    }

    render(): ReactNode {
        return (
            <div className="confirm-dialog">
                <DialogBody className="confirm-dialog-body">
                    <h4>
                        {this.props.text ?? ''}
                    </h4>
                </DialogBody>
                <DialogFooter>
                    <span className="confirm-dialog-error">{this.state.errorMessage ?? ""}</span>
                    {!!this.state.isLoading ?
                        <Spinner animation="border" variant="primary" /> :
                        null
                    }
                    <Button variant="secondary" onClick={this.props.onClose}>
                        取消
                    </Button>
                    <Button variant="primary" disabled={!!this.state.isLoading} onClick={this._onConfirm}>
                        確認
                    </Button>
                </DialogFooter>
            </div>
        );
    }
}

export default ConfirmDialog;