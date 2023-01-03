import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import { getDatabase, Query } from "4dmetaverse_admin_sdk/database";

import "./Users.scss";

import Table from "../../components/table/Table";
import Search from "../../components/search/Search";
import { userRoleOptions } from "../../mapping/MUserRole";
import { userStatusOptions } from "../../mapping/MUserStatus";
import UserNameCell from "../../components/cells/user/UserNameCell";
import UserRoleCell from "../../components/cells/user/UserRoleCell";
import { showDialog } from "../../components/dialog/base/DialogBase";
import UserStatusCell from "../../components/cells/user/UserStatusCell";
import UserAvatarCell from "../../components/cells/user/UserAvatarCell";
import UserActionCell from "../../components/cells/user/UserActionCell";
import UserCreateDialog from "../../components/dialog/user/UserCreateDialog";
import WrappedDatetimeCell from "../../components/cells/WrappedDatetimeCell";
import { withNavigator, WithNavigatorProps } from "../../wrapper/WithNavigator";
import { buildFilterDbQuery, FilterItem, FilterType } from "../../utils/SearchFilter";

interface UsersState {
    isLoading: boolean;
    data: any[];
    total: number;
}

class Users extends Component<WithNavigatorProps, UsersState> {
    private _query: Query;

    constructor(prop: any) {
        super(prop);
        this.state = {
            isLoading: true,
            data: [],
            total: 0
        }
        this._query = getDatabase().query('user').orderBy('user.create_at', 'desc').limit(0, 25);
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
        const query = getDatabase().query('user').orderBy('user.create_at', 'desc').limit(0, 25);
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
            return (<UserCreateDialog onClose={close} onSuccess={this._onCreateSuccess} />)
        });
    }

    private _onCreateSuccess = async (id: string): Promise<void> => {
        this.props.navigate(`/home/user-detail?userId=${id}`);
    }

    render(): ReactNode {
        return (
            <div className="client-users">
                <h1 className="mb-5">用戶列表</h1>
                <div className="client-users-area">
                    <div className="w-100 d-flex pe-4 mb-2">
                        <Button
                            className="ms-auto"
                            onClick={this._onCreate}
                        >
                            新增
                        </Button>
                    </div>
                    <Table
                        pagination
                        className="client-users-table"
                        loading={this.state.isLoading}
                        onDataSupply={this._onDataSupply}
                        pageSize={25}
                        total={this.state.total}
                        headerInsert={
                            (<Search
                                filterSetting={[{
                                    key: "user.id",
                                    text: "Id",
                                    type: FilterType.inputEq,
                                }, {
                                    key: "user.name",
                                    text: "名稱",
                                }, {
                                    key: "user.email",
                                    text: "email",
                                }, {
                                    key: "user.status",
                                    text: "狀態",
                                    type: FilterType.dropdown,
                                    options: userStatusOptions
                                }, {
                                    key: "user.role",
                                    text: "角色",
                                    type: FilterType.dropdown,
                                    options: userRoleOptions
                                }]}
                                onSearchUpdate={this._onSearchUpdate}
                            />)
                        }
                        column={[{
                            text: "",
                            element: (data: any) => (<UserAvatarCell />)
                        }, {
                            text: "名稱",
                            element: (data: any) => (<UserNameCell id={data["id"]} name={data["name"]} />)
                        }, {
                            text: "email",
                            key: "email",
                        }, {
                            text: "角色",
                            element: (data: any) => (<UserRoleCell role={data["role"]} />)
                        }, {
                            text: "狀態",
                            element: (data: any) => (<UserStatusCell status={data["status"]} />)
                        }, {
                            text: "建立時間",
                            element: (data: any) => (<WrappedDatetimeCell dateTime={data["createAt"]} />)
                        }, {
                            text: "快速操作",
                            width: "10%",
                            element: (data: any) => (<UserActionCell userId={data["id"]} />),
                        }]}
                        data={this.state.data} />
                </div>
            </div>
        );
    }
}

export default withNavigator(Users);