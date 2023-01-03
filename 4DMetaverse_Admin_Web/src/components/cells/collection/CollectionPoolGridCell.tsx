import { Component, ReactNode } from 'react';
import { ICollectionPool } from '4dmetaverse_admin_sdk/collection';

import './CollectionPoolGridCell.scss';
import GenericDatetimeCell from '../GenericDatetimeCell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface CollectionPoolCreateProp {
    collectionPool: ICollectionPool;
    onClick: (id: string) => void;
}

class CollectionPoolGridCell extends Component<CollectionPoolCreateProp>{
    render(): ReactNode {
        return (
            <div
                className="collection-pool-grid-cell"
                onClick={() => this.props.onClick(this.props.collectionPool.id!)}
            >
                <img src={this.props.collectionPool.coverImageUrl} />
                <div className="collection-pool-grid-cell-body">
                    <h4>{this.props.collectionPool.name}</h4>
                    <div className="collection-pool-grid-cell-data">
                        <div className="d-flex align-items-center">
                            <span className="me-2">#</span>
                            <span>{this.props.collectionPool.id}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon className="me-2" icon={faCalendar} />
                            <GenericDatetimeCell
                                className="collection-pool-grid-cell-create-at"
                                dateTime={this.props.collectionPool.createAt!}
                                format="yyyy/MM/dd HH:mm:ss"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CollectionPoolGridCell;