import { Component, ReactNode } from 'react';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './FileNameCell.scss';

interface FileNameCellProp {
    name: string;
}

class FileNameCell extends Component<FileNameCellProp> {
    render(): ReactNode {
        return (
            <div className="file-name-cell d-flex align-items-center">
                <FontAwesomeIcon className="me-2" width={28} icon={faFile} />
                <span className='px-2'>{this.props.name}</span>
            </div>
        )
    }
}

export default FileNameCell;