import Tab from 'react-bootstrap/esm/Tab';
import Tabs from 'react-bootstrap/esm/Tabs';
import { Component, ReactNode } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';
import { getUser, IUser } from '4dmetaverse_admin_sdk/user';

import './UserDetail.scss';

import UserBasicInfo from '../../section/user/UserBasicInfo';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';

interface UserDetailState {
    user?: IUser;
    isLoading: boolean;
    currentTab: string | null;
}

class UserDetail extends Component<WithNavigatorProps, UserDetailState>{
    private _userId: string;
    constructor(prop: WithNavigatorProps) {
        super(prop);
        this.state = {
            isLoading: true,
            currentTab: "basic-info"
        }
        this._userId = prop.searchParams.get('userId')!;
    }

    async componentDidMount(): Promise<void> {
        this._loadData();
    }

    private _loadData = async (): Promise<void> => {
        this.setState({
            isLoading: true
        });
        const user = await getUser().get(this._userId);
        this.setState({
            user: user,
            isLoading: false
        });
    }

    private _buildBody = (): ReactNode => {
        switch (this.state.currentTab) {
            case 'basic-info':
                return (<UserBasicInfo user={this.state.user!} onRefresh={this._loadData} />)
            default:
                return (<></>);
        }
    }

    render(): ReactNode {
        return (
            <div className="user-detail">
                <h1 className="mb-5">用戶詳細資料</h1>
                <div className="user-detail-tabs" >
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
        )
    }
}

export default withNavigator(UserDetail);