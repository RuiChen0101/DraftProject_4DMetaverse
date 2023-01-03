import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { getDatabase, Query } from '4dmetaverse_admin_sdk/database';

import './CollectionPools.scss';

import Grid from '../../components/grid/Grid';
import Search from '../../components/search/Search';
import { showDialog } from '../../components/dialog/base/DialogBase';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';
import { buildFilterDbQuery, FilterItem, FilterType } from '../../utils/SearchFilter';
import CollectionPoolGridCell from '../../components/cells/collection/CollectionPoolGridCell';
import CollectionPoolCreateDialog from '../../components/dialog/collection/CollectionPoolCreateDialog';

interface CollectionPoolsState {
    isLoading: boolean;
    data: any[];
    total: number;
}

class CollectionPools extends Component<WithNavigatorProps, CollectionPoolsState> {
    private _query: Query;

    constructor(prop: any) {
        super(prop);
        this.state = {
            isLoading: true,
            data: [],
            total: 0
        }
        this._query = getDatabase().query('collection_pool').orderBy('collection_pool.create_at', 'desc').limit(0, 15);
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
        const query = getDatabase().query('collection_pool').orderBy('collection_pool.create_at', 'desc').limit(0, 15);
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
            return (<CollectionPoolCreateDialog onClose={close} onSuccess={this._navToDetail} />)
        });
    }

    private _navToDetail = async (id: string): Promise<void> => {
        this.props.navigate(`/home/collection-pool-detail?poolId=${id}`);
    }

    render(): ReactNode {
        return (
            <div className="collection-pools">
                <h1 className="mb-5">收藏池</h1>
                <div className="collection-pools-area">
                    <div className="w-100 d-flex pe-4 mb-3">
                        <Button className="ms-auto" onClick={this._onCreate}>
                            新增
                        </Button>
                    </div>
                    <div className="collection-pools-search py-1">
                        <Search
                            filterSetting={[{
                                key: "collection_pool.id",
                                text: "Id",
                                type: FilterType.inputEq
                            }, {
                                key: "collection_pool.name",
                                text: "名稱",
                            }]}
                            onSearchUpdate={this._onSearchUpdate}
                        />
                    </div>
                    <div className="collection-pools-grid">
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
                                    <CollectionPoolGridCell
                                        collectionPool={data}
                                        onClick={this._navToDetail}
                                    />
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigator(CollectionPools);