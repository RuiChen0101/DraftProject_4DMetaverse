import { Component, ReactNode } from 'react';

interface FileSizeCellProp {
    size: number;
}

class FileSizeCell extends Component<FileSizeCellProp> {

    private _formatBytes(bytes: number) {
        if (bytes === 0) return '0Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + sizes[i];
    }

    render(): ReactNode {
        return (
            <span>{this._formatBytes(this.props.size)}</span>
        );
    }
}

export default FileSizeCell;