import { Component, ReactNode } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import { getAuth } from '4dmetaverse_admin_sdk/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faUser,
    faShop,
    faDashboard,
    faFolderOpen,
    faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import './Sidebar.scss';

import SidebarGroup from './SidebarGroup';
import SidebarButton from './SidebarButton';
import SidebarDivider from './SidebarDivider';
import { withNavigator, WithNavigatorProps } from '../../wrapper/WithNavigator';

class Sidebar extends Component<WithNavigatorProps> {
    private _auth = getAuth();

    private _logout = async (): Promise<void> => {
        await this._auth.logout();
        this.props.navigate('/', { replace: true });
    }

    render(): ReactNode {
        return (
            <div className="sidebar">
                <div className="title">
                    <img src={require('../../assets/logo.png')} alt="logo" />
                    <span>4DMetaverse管理後台</span>
                </div>
                <div className="nav">
                    <div className="w-100">
                        <SidebarButton to="/home" text="儀錶板" icon={faDashboard} />
                        <SidebarDivider />
                        <SidebarGroup title="用戶" key="user">
                            <SidebarButton to="/home/users" text="用戶列表" icon={faUser} />
                        </SidebarGroup>
                        <SidebarGroup title="收藏" key="collection">
                            <SidebarButton to="/home/collection-pools" text="收藏池" icon={faBox} />
                            <SidebarButton to="/home/shop-groups" text="商店群組" icon={faShop} />
                        </SidebarGroup>
                        <SidebarGroup title="儲存" key="storage">
                            <SidebarButton to="/home/storage" text="檔案管理" icon={faFolderOpen} />
                        </SidebarGroup>
                    </div>
                </div>
                <div className="user">
                    <Dropdown drop='end'>
                        <Dropdown.Toggle>
                            {`Hi, ${this._auth.accessTokenData?.name}`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this._logout}>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="me-2" icon={faArrowRightFromBracket} />
                                    <span>登出</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        );
    }
}

export default withNavigator(Sidebar);