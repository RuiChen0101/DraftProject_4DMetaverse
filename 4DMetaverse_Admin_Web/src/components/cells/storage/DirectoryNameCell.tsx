import { Component, ReactNode } from 'react';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DirectoryNameCell.scss';

interface DirectoryNameCellProp {
    name: string;
    onNameClick: () => void;
}

class DirectoryNameCell extends Component<DirectoryNameCellProp> {
    render(): ReactNode {
        return (
            <div className="directory-name-cell d-flex align-items-center">
                <FontAwesomeIcon className="me-2" width={28} icon={faFolder} />
                <span className='px-2' onClick={this.props.onNameClick}>{this.props.name}</span>
            </div>
        )
    }
}

export default DirectoryNameCell;