import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';

import './StandardDialogTemplate.scss';

import DialogBody from '../base/DialogBody';
import DialogFooter from '../base/DialogFooter';
import DialogHeader from '../base/DialogHeader';
import { DialogShareProp } from '../base/DialogBase';
import WithChildrenProps from '../../../props/WithChildrenProps';

interface StandardDialogTemplateProp extends DialogShareProp, WithChildrenProps {
    className?: string;
    isLoading?: boolean;
    errorMessage?: string;
    title?: string;
    closeText?: string;
    successText?: string;
    onSuccess?: () => void;
}

class StandardDialogTemplate extends Component<StandardDialogTemplateProp> {
    render(): ReactNode {
        return (
            <div className={`standard-dialog-template ${this.props.className ?? ""}`}>
                <DialogHeader title={this.props.title} onClose={this.props.onClose} closeButton />
                <DialogBody>{this.props.children}</DialogBody>
                <DialogFooter>
                    <span className="standard-dialog-template-error">{this.props.errorMessage ?? ""}</span>
                    {!!this.props.isLoading ?
                        <Spinner animation="border" variant="primary" /> :
                        null
                    }
                    <Button variant="secondary" onClick={this.props.onClose}>
                        {this.props.closeText ?? ""}
                    </Button>
                    <Button variant="primary" disabled={!!this.props.isLoading} onClick={this.props.onSuccess ?? this.props.onClose}>
                        {this.props.successText ?? ""}
                    </Button>
                </DialogFooter>
            </div>
        );
    }
}

export default StandardDialogTemplate;