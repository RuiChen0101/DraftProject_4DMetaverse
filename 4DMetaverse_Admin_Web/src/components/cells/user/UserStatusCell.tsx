import { Component, ReactNode } from "react";
import { EUserStatus } from "4dmetaverse_admin_sdk/user";

import "./UserStatusCell.scss";

import { mUserStatus } from "../../../mapping/MUserStatus";

interface UserStatusCellProp {
    status: number;
}

class UserStatusCell extends Component<UserStatusCellProp> {
    private _class: string = "";

    constructor(prop: UserStatusCellProp) {
        super(prop);
        switch (prop.status) {
            case EUserStatus.Active:
                this._class = "active";
                break;
            case EUserStatus.Blocked:
                this._class = "block";
                break;
            case EUserStatus.Deleted:
                this._class = "deleted";
                break;
        }
    }

    render(): ReactNode {
        return (
            <div className={`user-status-cell ${this._class}`}>
                <span>{mUserStatus[this.props.status]}</span>
            </div>
        )
    }
}

export default UserStatusCell;