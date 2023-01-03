import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import WithChildrenProps from '../props/WithChildrenProps';

interface AsyncButtonProp extends WithChildrenProps {
    variant?: string;
    spinnerVariant?: string;
    className?: string;
    onClick?: () => Promise<void>;
}

interface AsyncButtonState {
    isLoading: boolean;
}

class AsyncButton extends Component<AsyncButtonProp, AsyncButtonState>{

    constructor(prop: AsyncButtonProp) {
        super(prop);
        this.state = {
            isLoading: false
        }
    }

    private _onClick = async (): Promise<void> => {
        this.setState({
            isLoading: true
        });
        try {
            if (this.props.onClick !== undefined) {
                await this.props.onClick();
            }
            this.setState({
                isLoading: false
            });
        } catch (e: any) {
            this.setState({
                isLoading: false
            });
            throw e;
        }
    }

    render(): ReactNode {
        return (
            <Button
                disabled={this.state.isLoading}
                variant={this.props.variant ?? 'primary'}
                className={this.props.className}
                onClick={this._onClick}>
                {this.state.isLoading ?
                    <Spinner animation="border" variant={this.props.spinnerVariant ?? 'primary'} /> :
                    this.props.children}
            </Button>
        );
    }
}

export default AsyncButton;