import { Component, ReactNode } from 'react';
import GenericDatetimeCell from '../GenericDatetimeCell';
import { ICollection } from '4dmetaverse_admin_sdk/collection';

import './CollectionGridCell.scss';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mCollectionType } from '../../../mapping/MCollectionType';
import { mCollectionStatus } from '../../../mapping/MCollectionStatus';

interface CollectionGridCellProp {
    collection: ICollection;
    onClick: (id: string) => void;
}

class CollectionGridCell extends Component<CollectionGridCellProp>{
    render(): ReactNode {
        return (
            <div
                className="collection-grid-cell"
                onClick={() => this.props.onClick(this.props.collection.id!)}
            >
                <img src={this.props.collection.unlockedImageUrl} />
                <div className="collection-grid-cell-body">
                    <div className="d-flex mb-1">
                        <div className="collection-grid-cell-tag me-2">
                            {mCollectionType[this.props.collection.type!]}
                        </div>
                        <div className="collection-grid-cell-tag">
                            {mCollectionStatus[this.props.collection.status!]}
                        </div>
                    </div>
                    <h5 className="mb-1">{this.props.collection.name}</h5>
                    <div className="collection-grid-cell-data">
                        <div className="d-flex align-items-center">
                            <span className="me-2">#</span>
                            <span>{this.props.collection.id}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon className="me-2" icon={faCalendar} />
                            <GenericDatetimeCell
                                dateTime={this.props.collection.createAt!}
                                format="yyyy/MM/dd HH:mm:ss"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CollectionGridCell;