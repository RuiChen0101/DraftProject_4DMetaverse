import Form from "react-bootstrap/esm/Form";
import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { getUser, IUser } from "4dmetaverse_admin_sdk/user";

import "./UserBasicInfo.scss";

import TitleCard from "../../components/card/TitleCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { userRoleOptions } from "../../mapping/MUserRole";
import SelectOptionsBuilder from "../../components/form/SelectOptionsBuilder";
import { toast } from "react-toastify";

interface UserBasicInfoProp {
    onRefresh: () => void;
    user: IUser;
}

interface UserBasicInfoState {
    editableUser: IUser;
    isLoading: boolean;
    isEditing: boolean;
}

class UserBasicInfo extends Component<UserBasicInfoProp, UserBasicInfoState> {
    constructor(prop: UserBasicInfoProp) {
        super(prop);
        this.state = {
            editableUser: JSON.parse(JSON.stringify(prop.user)),
            isLoading: false,
            isEditing: false
        };
    }

    private _onBasicInfoSave = async (): Promise<void> => {
        this.setState({
            isLoading: true,
            isEditing: false
        });
        try {
            const user = this.state.editableUser;
            await getUser().update(this.props.user.id!, {
                name: user.name,
                role: user.role,
            });
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            this.setState({
                isLoading: false
            });
            this.props.onRefresh();
        }
    }

    render(): ReactNode {
        return (
            <div className="user-basic-info">
                {
                    this.state.isLoading ?
                        <Spinner animation="border" variant="primary" />
                        :
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <TitleCard className="mb-3" title="基本資料">
                                        <div className="d-flex flex-column mb-3">
                                            <div className="ms-auto">
                                                {
                                                    this.state.isEditing ?
                                                        <>
                                                            <Button className="me-3" variant="secondary" onClick={() => {
                                                                this.setState({
                                                                    editableUser: JSON.parse(JSON.stringify(this.props.user)),
                                                                    isEditing: false
                                                                })
                                                            }}>
                                                                取消
                                                            </Button>
                                                            <Button variant="success" onClick={this._onBasicInfoSave} >
                                                                儲存
                                                            </Button>
                                                        </>
                                                        :
                                                        <Button onClick={() => this.setState({ isEditing: true })}>
                                                            修改
                                                        </Button>
                                                }
                                            </div>
                                        </div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                用戶名稱
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="用戶名稱"
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableUser.name}
                                                onChange={(e) => {
                                                    const u = this.state.editableUser;
                                                    u.name = e.target.value;
                                                    this.setState({ editableUser: u });
                                                }}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                email
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="email"
                                                disabled={true}
                                                value={this.state.editableUser.email}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                角色
                                            </InputGroup.Text>
                                            <Form.Select
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableUser.role}
                                                onChange={(e) => {
                                                    const u = this.state.editableUser;
                                                    u.role = parseInt(e.target.value);
                                                    this.setState({ editableUser: u });
                                                }}
                                            >
                                                <SelectOptionsBuilder data={userRoleOptions} />
                                            </Form.Select>
                                        </InputGroup>
                                    </TitleCard>
                                    <TitleCard title="更改密碼">

                                    </TitleCard>
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <TitleCard className="mb-3" title="屬性">

                                    </TitleCard>
                                    <TitleCard title="登入方法">

                                    </TitleCard>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default UserBasicInfo;