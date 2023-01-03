import React from 'react';
import { Component, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';

interface ShowFileSelectProp {
    accept?: string;
    onSelect?: (file: FileList | null) => void | Promise<void>
}

class ShowFileSelect extends Component<ShowFileSelectProp> {
    private _ref = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        this._ref.current!.click();
    }

    render(): ReactNode {
        return <input
            ref={this._ref}
            type="file"
            id="show-file-select"
            accept={this.props.accept}
            style={{ "display": "hidden" }}
            onChange={
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (this.props.onSelect !== undefined) this.props.onSelect(e.target.files);
                    removeFileSelect();
                }
            } />
    }
}

let root: Root | undefined = undefined;

function showFileSelect(prop: ShowFileSelectProp) {
    let divTarget = document.getElementById('react-show-file-select');

    if (!divTarget) {
        divTarget = document.createElement('div');
        divTarget.id = 'react-show-file-select';
        document.body.appendChild(divTarget);
    }
    if (root !== undefined) root.unmount();
    root = createRoot(divTarget);
    root.render(<ShowFileSelect {...prop} />);
}

function removeFileSelect() {
    if (root) root.unmount();
}

export default showFileSelect;