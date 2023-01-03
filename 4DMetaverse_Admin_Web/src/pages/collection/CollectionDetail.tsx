import Tab from 'react-bootstrap/esm/Tab';
import Tabs from 'react-bootstrap/esm/Tabs';
import { Component, ReactNode } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';
import { getCollection, ICollection } from '4dmetaverse_admin_sdk/collection';

import './CollectionDetail.scss';

import CollectionBasicInfo from '../../section/collection/CollectionBasicInfo';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';

interface CollectionDetailState {
    collection?: ICollection;
    isLoading: boolean;
    currentTab: string | null;
}

class CollectionDetail extends Component<WithNavigatorProps, CollectionDetailState> {
    private _collectionId: string = '';
    constructor(prop: WithNavigatorProps) {
        super(prop);
        this._collectionId = prop.searchParams.get('collectionId')!;
        this.state = {
            isLoading: true,
            currentTab: 'basic-info'
        }
    }

    componentDidMount(): void {
        this._loadData();
    }

    private _loadData = async (): Promise<void> => {
        this.setState({
            isLoading: true,
        });
        const collection = await getCollection().get(this._collectionId);
        this.setState({
            collection: collection,
            isLoading: false
        });
    }

    private _buildBody = (): ReactNode => {
        switch (this.state.currentTab) {
            case 'basic-info':
                return (<CollectionBasicInfo collection={this.state.collection!} onRefresh={this._loadData} />)
            default:
                return (<></>);
        }
    }

    render(): ReactNode {
        return (
            <div className="collection-detail">
                <h1 className="mb-5">收藏池詳細資料</h1>
                <div className="collection-detail-tabs" >
                    <Tabs
                        defaultActiveKey="basic-info"
                        className="mb-3"
                        onSelect={(eventKey: string | null, e: any) => this.setState({ currentTab: eventKey })}
                    >
                        <Tab eventKey="basic-info" title="基本資料" />
                    </Tabs>
                    {
                        this.state.isLoading ?
                            <Spinner animation="border" variant="primary" /> :
                            this._buildBody()
                    }
                </div>
            </div>
        );
    }
}

export default withNavigator(CollectionDetail);