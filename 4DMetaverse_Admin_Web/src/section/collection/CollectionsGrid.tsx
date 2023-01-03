import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { getDatabase, Query } from '4dmetaverse_admin_sdk/database';

import './CollectionsGrid.scss';

import Grid from '../../components/grid/Grid';
import Search from '../../components/search/Search';
import TitleCard from '../../components/card/TitleCard';
import { showDialog } from '../../components/dialog/base/DialogBase';
import { collectionTypeOptions } from '../../mapping/MCollectionType';
import { collectionStatusOptions } from '../../mapping/MCollectionStatus';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';
import CollectionGridCell from '../../components/cells/collection/CollectionGridCell';
import { FilterItem, buildFilterDbQuery, FilterType } from '../../utils/SearchFilter';
import CollectionCreateDialog from '../../components/dialog/collection/CollectionCreateDialog';

interface CollectionsGridProp extends WithNavigatorProps {
    poolId: string;
}

interface CollectionPoolsState {
    isLoading: boolean;
    data: any[];
    total: number;
}

class CollectionsGrid extends Component<CollectionsGridProp, CollectionPoolsState> {
    private _query: Query;

    constructor(prop: CollectionsGridProp) {
        super(prop);
        this.state = {
            isLoading: true,
            data: [],
            total: 0
        }
        this._query = getDatabase()
            .query("collection")
            .where("collection.collection_pool_id", "=", prop.poolId)
            .orderBy("collection.create_at", "desc")
            .limit(0, 15);
    }

    async componentDidMount(): Promise<void> {
        const result = await this._query.get();
        this.setState({
            data: result.data,
            total: result.totalCount,
            isLoading: false
        })
    }

    private _onSearchUpdate = async (items: FilterItem[]): Promise<void> => {
        this.setState({
            isLoading: true
        });
        const query = getDatabase()
            .query("collection")
            .where("collection.collection_pool_id", "=", this.props.poolId)
            .orderBy("collection.create_at", "desc")
            .limit(0, 15);
        for (const item of items) {
            buildFilterDbQuery(item, query);
        }
        this._query = query;
        const result = await this._query.get();
        this.setState({
            data: result.data,
            total: result.totalCount,
            isLoading: false
        });
    }

    private _onDataSupply = async (offset: number, size: number): Promise<void> => {
        this.setState({
            isLoading: true
        });
        const result = await this._query.limit(offset, size).get();
        this.setState({
            data: [...this.state.data, ...result.data],
            isLoading: false
        });
    }

    private _onCreate = (): void => {
        showDialog((close: () => void): ReactNode => {
            return (<CollectionCreateDialog
                poolId={this.props.poolId}
                onClose={close}
                onSuccess={this._navToDetail}
            />)
        });
    }

    private _navToDetail = async (id: string): Promise<void> => {
        this.props.navigate(`/home/collection-detail?collectionId=${id}`);
    }

    render(): ReactNode {
        return (
            <TitleCard title="收藏列表" fluid>
                <div className="collections-grid">
                    <div className="d-flex flex-column pe-4 mb-3">
                        <Button className="ms-auto" onClick={this._onCreate}>
                            新增
                        </Button>
                    </div>
                    <div className="collection-search py-1">
                        <Search
                            filterSetting={[{
                                key: "collection.id",
                                text: "Id",
                                type: FilterType.inputEq
                            }, {
                                key: "collection.name",
                                text: "名稱",
                            }, {
                                key: "collection.status",
                                text: "狀態",
                                type: FilterType.dropdown,
                                options: collectionStatusOptions
                            }, {
                                key: "collection.type",
                                text: "類型",
                                type: FilterType.dropdown,
                                options: collectionTypeOptions
                            }]}
                            onSearchUpdate={this._onSearchUpdate}
                        />
                    </div>
                    <div className="collection-grid">
                        <Grid
                            pagination
                            className="mt-3 px-3"
                            minSize="300px"
                            loading={this.state.isLoading}
                            pageSize={15}
                            total={this.state.total}
                            data={this.state.data}
                            onDataSupply={this._onDataSupply}
                            cell={(data: any): ReactNode => {
                                return (
                                    <CollectionGridCell
                                        collection={data}
                                        onClick={this._navToDetail}
                                    />
                                )
                            }}
                        />
                    </div>
                </div>
            </TitleCard>
        )
    }
}

export default withNavigator(CollectionsGrid);