import { Component, ReactNode } from "react";

import "./CollectionPoolDetail.scss";

import CollectionsGrid from "../../section/collection/CollectionsGrid";
import { withNavigator, WithNavigatorProps } from "../../wrapper/WithNavigator";
import CollectionPoolBasicInfo from "../../section/collection/CollectionPoolBasicInfo";

class CollectionPoolDetail extends Component<WithNavigatorProps> {
    private _poolId: string;

    constructor(prop: WithNavigatorProps) {
        super(prop);
        this._poolId = prop.searchParams.get('poolId')!;
    }

    render(): ReactNode {
        return (
            <div className="collection-pool-detail">
                <h1 className='mb-5'>收藏池詳細資料</h1>
                <CollectionPoolBasicInfo poolId={this._poolId} />
                <CollectionsGrid poolId={this._poolId} />
            </div>
        );
    }
}

export default withNavigator(CollectionPoolDetail);