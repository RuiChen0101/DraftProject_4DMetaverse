import { Component, ReactNode } from "react";
import { NavLink } from 'react-router-dom';

import './UserNameCell.scss';

interface UserNameCellProp {
    id: string;
    name: string;
}

class UserNameCell extends Component<UserNameCellProp>{
    render(): ReactNode {
        return (
            <div className="user-name-cell">
                <div className="d-flex flex-column text-start">
                    <NavLink end to={`/home/user-detail?userId=${this.props.id}`} className="name">{this.props.name}</NavLink>
                    <span className="id">{"#" + this.props.id}</span>
                </div>
            </div>
        )
    }
}

export default UserNameCell;