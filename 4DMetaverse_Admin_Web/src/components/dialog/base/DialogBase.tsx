import { Component, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';

import './DialogBase.scss';

interface DialogProp {
    render: (close: () => void) => ReactNode;
    noBackdrop?: boolean;
    size?: string;
}

interface DialogShowProp {
    noBackdrop?: boolean;
    size?: string;
}

interface DialogShareProp {
    onClose: () => void;
}

interface DialogBaseState {
    isShow: boolean;
}

class DialogBase extends Component<DialogProp, DialogBaseState> {

    constructor(prop: DialogProp) {
        super(prop);
        this.state = {
            isShow: false
        }
    }

    componentDidMount(): void {
        document.addEventListener('keydown', this._onKeyStroke);

        setTimeout(() => {
            this.setState({ isShow: true });
        }, 10)
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this._onKeyStroke);
    }

    private _onBackdropClick = (e: any): void => {
        if (!!this.props.noBackdrop || !e.target.classList.contains('dialog-base')) return;
        this._onClose();
    }

    private _onKeyStroke = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this._onClose();
        }
    }

    private _onClose = (): void => {
        this.setState({ isShow: false });
        setTimeout(() => {
            removeDialog();
            removeBodyClass();
        }, 150);
    }

    render(): ReactNode {
        return (
            <>
                <div className={`dialog-backdrop ${this.state.isShow ? "show" : ""}`} />
                <div
                    className={`dialog-base ${this.state.isShow ? "show" : ""}`}
                    onClick={this._onBackdropClick}
                >
                    <div className={`dialog-content dialog-content-size-${this.props.size ?? 'sm'}`}>
                        <div className="dialog">
                            {this.props.render(this._onClose)}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

let root: Root | undefined = undefined;

function renderDialog(render: (close: () => void) => ReactNode, props?: DialogShowProp) {
    let divTarget = document.getElementById('react-dialog');

    if (divTarget) {
        root = createRoot(divTarget);
        root.render(<DialogBase render={render} {...props} />);
    } else {
        divTarget = document.createElement('div');
        divTarget.id = 'react-dialog';
        document.body.appendChild(divTarget);
        root = createRoot(divTarget);
        root.render(<DialogBase render={render} {...props} />);
    }
}

function removeDialog() {
    if (root) root.unmount();
}

function addBodyClass() {
    document.body.classList.add('react-dialog-open');
}

function removeBodyClass() {
    document.body.classList.remove('react-dialog-open');
}

function showDialog(render: (close: () => void) => ReactNode, props?: DialogShowProp) {
    addBodyClass();
    renderDialog(render, props);
}

export default DialogBase;
export type { DialogShareProp }
export { showDialog }